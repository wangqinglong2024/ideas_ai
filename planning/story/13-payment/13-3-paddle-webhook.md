# Story 13.3: Paddle Webhook 处理

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **可靠地接收并处理 Paddle 的 transaction / subscription / payment 事件**，
以便 **订单状态、订阅生命周期、退款链路、佣金触发都能准确实时落库，并对乱序、重放、丢失保持幂等**。

## Acceptance Criteria

1. 路由 `POST /webhooks/paddle` 公开可达，启用专属限流（每 IP 60 req/min；总 600 req/min）。
2. 签名校验：使用 `Paddle-Signature` header（`ts;h1`格式）+ `PADDLE_WEBHOOK_SECRET` 做 HMAC-SHA256；ts 与服务器时差 > 5min 拒绝。
3. 事件落 `webhook_events` 表（id / vendor / event_id unique / event_type / payload_jsonb / received_at / processed_at / status）；先落库后回 200，避免 Paddle 重试风暴。
4. 异步 worker（BullMQ queue `paddle-webhook`）按 event_id 串行消费同一 subscription / order；幂等键 = `vendor + event_id`；已处理直接 ack。
5. 处理事件最少集合：`transaction.completed` / `transaction.payment_failed` / `subscription.created` / `subscription.activated` / `subscription.updated` / `subscription.canceled` / `subscription.past_due` / `subscription.paused` / `adjustment.created`（退款）。
6. `transaction.completed`：解析 passthrough.order_id → 标记 `payment_orders.status=paid` + `paid_at` + 更新 `subscriptions`（initial 创建，renewal 更新 current_period_*）+ 充值包发 ZC（调 economy.issue）+ 触发 referral.commission（emit event `order.paid`）。
7. `subscription.canceled` / `paused` / `past_due`：同步状态；记录 `canceled_at` / `cancel_at`；不立即收回订阅期，按 `current_period_end` 自然过期。
8. `adjustment.created` (refund)：定位原订单 → 写 type=refund 的 `payment_orders` + 更新原订单 status；emit `order.refunded` 给 referral 反向。
9. 失败重试：worker 失败 → 指数退避（1s / 5s / 30s / 5min / 30min / 2h）最多 6 次 → DLQ 告警。
10. 主动轮询补偿：每 6h cron 拉取近 24h Paddle transactions，对比本地 paid，差异 → enqueue 重放。

## Tasks / Subtasks

- [ ] **路由 + 签名校验**（AC: 1,2）
  - [ ] `apps/api/src/routes/webhooks/paddle.ts`
  - [ ] `packages/payment/paddle/verify-signature.ts`

- [ ] **事件落库 + 队列**（AC: 3,4,9）
  - [ ] `webhook_events` 表 migration
  - [ ] BullMQ queue + worker `apps/api/src/workers/paddle-webhook.ts`

- [ ] **事件处理器**（AC: 5,6,7,8）
  - [ ] `packages/payment/paddle/handlers/transaction-completed.ts`
  - [ ] `…/subscription-lifecycle.ts`
  - [ ] `…/adjustment-refund.ts`
  - [ ] 各 handler 单元测试覆盖正常 + 重放

- [ ] **事件总线**（AC: 6,8）
  - [ ] emit `order.paid` / `order.refunded` 通过 Redis pub/sub
  - [ ] 文档化事件 contract（`packages/events/payment.ts`）

- [ ] **轮询补偿 cron**（AC: 10）
  - [ ] `apps/api/src/crons/paddle-reconcile.ts`
  - [ ] 每 6h 调 Paddle list transactions

- [ ] **观测**（AC: 9,10）
  - [ ] Sentry breadcrumb：event_id / type
  - [ ] DLQ 告警 → Slack #alerts-payment

## Dev Notes

### 关键约束
- Paddle 重试策略最长 3 天 / 指数级，本地必须幂等。
- 事件可能乱序（subscription.activated 后于 transaction.completed），处理器需「以 vendor_subscription_id 为权威」做合并。
- 切勿在 webhook 同步路径调外部慢服务（economy.issue 也走异步）。
- ZC 单位：充值包 `coins_grant + 1ZC = 1USD美分 * fx`。

### 关联后续 stories
- 13-7 退款流程消费 `adjustment.created`
- 14-6 commission 监听 `order.paid`
- 13-9 续费提醒消费 `subscription.updated.next_billing_at`

### Project Structure Notes
- `apps/api/src/routes/webhooks/paddle.ts`
- `apps/api/src/workers/paddle-webhook.ts`
- `apps/api/src/crons/paddle-reconcile.ts`
- `packages/payment/paddle/`
- `packages/db/schema/webhook-events.ts`

### References
- `planning/epics/13-payment.md` ZY-13-03
- `planning/spec/07-integrations.md` § 3.1
- Paddle Webhook Reference: https://developer.paddle.com/webhooks/overview

### 测试标准
- 单元：签名校验通过 / 篡改 ts 拒绝
- 集成：重放同一 event_id 不二次执行
- E2E：sandbox 触发完整链 → DB 状态正确
- Chaos：handler 抛错 → 6 次重试后 DLQ

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

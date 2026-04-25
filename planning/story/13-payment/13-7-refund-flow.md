# Story 13.7: 退款流程

Status: ready-for-dev

## Story

作为 **客服 / 财务管理员**，
我希望 **在后台对指定订单发起 Paddle / LemonSqueezy 退款，并联动 ZC、解锁、佣金的回收**，
以便 **保护财务一致性，避免退款后用户仍持有未付费权益**。

## Acceptance Criteria

1. 后台 `/admin/orders/:id` 显示订单详情 + 「发起退款」按钮（仅 status=paid 且未全退）；权限 `finance:refund`（E17 RBAC）。
2. 退款 modal：金额（默认全额，可改部分）/ 原因（dropdown：用户主动 / 重复扣款 / 服务问题 / 欺诈 / 其他）/ 备注；二次确认。
3. 调用 vendor API：Paddle `POST /transactions/:id/refund`、LS `POST /v1/refunds`；保存 vendor_refund_id。
4. 立即创建 type=refund 的 `payment_orders`（金额负值），status=pending；webhook（13-3/13-4）回到 refunded 后改 success。
5. 联动回收（在 webhook handler 内事务执行）：
   - **ZC 充值包**：从用户 coins_balances 扣回 `coins_grant + base_coins`；如余额不足允许负余额（标 `owed=true`）。
   - **订阅期**：标 `subscriptions.status='canceled'` + `paid_until=now()`；用户立即失去付费权益。
   - **解锁**：撤回该订单触发的所有解锁（如终身 ZC 大礼包对应）。
   - **佣金反向**：emit `order.refunded` → 触发 14-8 commission_reversed。
6. 通知用户：邮件 + 站内通知「您的订单 #XXX 已退款 $X.XX，预计 5-10 工作日到账」。
7. 部分退款：支持金额 < total，按比例回收 ZC（向下取整），订阅不取消（仅 metadata 标 partial_refund）。
8. 防滥用：单订单 30 天内最多 1 次退款发起；二次需高级权限 `finance:refund:override`。
9. 审计日志：admin_audit_logs 记录 admin_id / order_id / amount / reason / before-after 状态。
10. 报表：`/admin/finance/refunds` 列出近 90 天退款 + 原因分布饼图。

## Tasks / Subtasks

- [ ] **后台 UI**（AC: 1,2,10）
  - [ ] `apps/admin/src/routes/orders/[id].tsx`
  - [ ] `RefundModal.tsx`
  - [ ] `apps/admin/src/routes/finance/refunds.tsx`

- [ ] **后端 refund 发起 API**（AC: 1-4,8,9）
  - [ ] `apps/api/src/routes/admin/orders/refund.ts`
  - [ ] RBAC + rate-limit
  - [ ] 调 Paddle / LS API（按 vendor 分支）

- [ ] **Webhook 联动**（AC: 4,5）
  - [ ] 扩展 13-3 `adjustment.created` handler
  - [ ] 扩展 13-4 `order_refunded` handler
  - [ ] 事务回收 ZC / 订阅 / 解锁 / 触发 commission

- [ ] **通知**（AC: 6）
  - [ ] Email template `refund-confirmation.{lang}.html`
  - [ ] 站内通知 type=refund

- [ ] **部分退款逻辑**（AC: 7）
  - [ ] 比例计算单元测试

- [ ] **审计**（AC: 9）
  - [ ] 审计 helper 中间件

## Dev Notes

### 关键约束
- ZC 负余额规则：用户后续任何 issue 优先抵扣到正；UI 显示 `欠费 -X ZC`。
- 终身订阅退款 → 永久撤回付费权益；下次再买视为新订阅。
- 退款金额 = USD 美分；FX 由 vendor 处理，不再换算。

### 关联后续 stories
- 13-3 / 13-4 webhook 已就绪
- 14-8 commission_reversed 消费 `order.refunded`
- 17 admin RBAC 提供权限

### Project Structure Notes
- `apps/api/src/routes/admin/orders/refund.ts`
- `apps/admin/src/routes/finance/refunds.tsx`
- `packages/payment/refund-engine.ts`（共享）

### References
- `planning/epics/13-payment.md` ZY-13-07

### 测试标准
- 集成：全额 / 部分退款链路
- 单元：负余额标记 owed
- E2E：发起 → webhook → ZC 扣回 → 佣金反向

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

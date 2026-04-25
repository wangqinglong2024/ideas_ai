# Story 13.1: plans / subscriptions / payment_orders 表 + 索引 + RLS

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立支付与订阅的核心数据模型**，
以便 **Paddle / LemonSqueezy 集成、Checkout、Webhook、订阅管理、退款、对账等所有后续 stories 都有数据基座**。

## Acceptance Criteria

1. Drizzle schema 创建表：`plans`、`subscriptions`、`payment_orders`，所有主键 uuid v7（`gen_random_uuid()`），含 `created_at` / `updated_at` / `deleted_at` 审计字段。
2. `plans` 字段：id / code（unique，如 `monthly` / `yearly` / `lifetime` / `coins_500`）/ type（subscription | one_time | coins_pack）/ name_i18n_jsonb / price_usd_cents / billing_cycle（monthly|yearly|null）/ coins_grant（充值包额外赠送 ZC）/ paddle_product_id / lemonsqueezy_product_id / status（active|archived）/ display_order。
3. `subscriptions` 字段：id / user_id (FK users) / plan_id (FK plans) / vendor（paddle|lemonsqueezy）/ vendor_subscription_id / status（trialing|active|past_due|paused|canceled|expired）/ current_period_start / current_period_end / cancel_at / canceled_at / next_billing_at / metadata_jsonb；唯一索引 (vendor, vendor_subscription_id)；索引 (user_id, status)。
4. `payment_orders` 字段：id / user_id / plan_id / type（subscription_initial|subscription_renewal|one_time|coins_pack|refund）/ vendor / vendor_order_id / vendor_checkout_id / amount_usd_cents / currency / fx_rate / amount_local_cents / coupon_id / status（pending|paid|failed|refunded|partial_refunded）/ paid_at / refunded_at / refund_amount_cents / metadata_jsonb；唯一索引 (vendor, vendor_order_id)；索引 (user_id, status, paid_at desc)。
5. RLS：用户仅能 SELECT 自己 `subscriptions` 与 `payment_orders`；`plans` 公共可读 active；写操作仅 service_role。
6. Migration 包含 12 条 seed 套餐：月 / 年 / 终身 + 4 档充值包（500 / 1500 / 5000 / 15000 ZC，分别附 0 / 10% / 20% / 30% bonus）+ name_i18n（zh/en/vi/th/id）。
7. 状态机文档化：subscriptions / payment_orders 各自合法转移列于 `packages/db/docs/payment-state-machines.md`。
8. 索引验证：`SELECT … FROM payment_orders WHERE user_id=? ORDER BY paid_at DESC LIMIT 50` 在 100k 订单下 P95 < 80ms。

## Tasks / Subtasks

- [ ] **Schema 与 migration**（AC: 1-6）
  - [ ] `packages/db/schema/payment.ts`
  - [ ] migration 脚本 + rollback
  - [ ] seed `packages/db/seeds/payment-plans.ts`（12 plans + i18n）

- [ ] **RLS 策略**（AC: 5）
  - [ ] `plans`: SELECT to public WHERE status='active'
  - [ ] `subscriptions`/`payment_orders`: SELECT USING auth.uid() = user_id

- [ ] **状态机文档**（AC: 7）
  - [ ] 用 mermaid stateDiagram 画两张图
  - [ ] 列出每条转移触发源（webhook / cron / admin）

- [ ] **索引性能验证**（AC: 8）
  - [ ] EXPLAIN ANALYZE 主查询
  - [ ] 必要时加 (user_id, paid_at desc) 复合索引

## Dev Notes

### 关键约束
- 金额一律使用整数 cents 存储，避免浮点；`amount_usd_cents` 为审计真值，`amount_local_cents` 用于显示。
- `vendor_subscription_id` / `vendor_order_id` 是 Paddle / LemonSqueezy 唯一键，幂等以此为锚。
- `payment_orders.type='refund'` 时 `amount_usd_cents` 为负值，关联原订单通过 `metadata_jsonb.original_order_id`。
- 不创建 `invoices` 表（v1 不开发票）。

### 关联后续 stories
- 13-2 Paddle Checkout 写入 `payment_orders` (status=pending)
- 13-3 Paddle Webhook 改 `payment_orders.status` 与 `subscriptions.*`
- 13-4 LemonSqueezy 共用同一套表，仅 vendor 字段不同
- 13-7 退款 → 创建 type=refund 的 `payment_orders`
- 13-10 对账查询 `payment_orders`
- E14 commission webhook 监听 `payment_orders.status='paid'`

### Project Structure Notes
- `packages/db/schema/payment.ts`
- `packages/db/seeds/payment-plans.ts`
- `packages/db/docs/payment-state-machines.md`
- `packages/db/migrations/20260801_payment_tables.sql`

### References
- `planning/epics/13-payment.md` ZY-13-01
- `planning/spec/05-data-model.md` § 4.12 / § 三-7
- `planning/sprint/13-payment.md` 第 1 行

### 测试标准
- 单元：状态机非法转移抛错（`pending → refunded` 不允许）
- 集成：seed plans 多语字段读取；RLS 验证用户 A 无法读 B 的 orders
- 性能：100k orders P95 < 80ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

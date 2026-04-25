# Story 13.4: LemonSqueezy 备份集成

Status: ready-for-dev

## Story

作为 **Paddle 不可用国家的用户**，
我希望 **平台自动切换到 LemonSqueezy 通道继续完成支付**，
以便 **不会因为单一 MoR 的国家限制而无法订阅或充值**。

## Acceptance Criteria

1. LemonSqueezy Sandbox + Production Store 接入；Products 与 `plans.lemonsqueezy_product_id` 同步脚本完成。
2. 后端 `POST /api/payments/lemonsqueezy/checkout` 与 13-2 Paddle 接口对称：参数相同（plan_id, coupon_code），返回 `{checkout_url}`（LemonSqueezy 走 hosted checkout）。
3. 前端遇 Paddle 不可用（`payment.fallback` 事件）或用户主动切换 → 跳 `checkout_url`；成功重定向 `/payment/success?order=:id`。
4. Webhook `POST /webhooks/lemonsqueezy` 与 13-3 共用同一事件总线、同一 `webhook_events` 表（vendor='lemonsqueezy'），处理事件：`order_created` / `order_refunded` / `subscription_created` / `subscription_updated` / `subscription_cancelled` / `subscription_payment_success` / `subscription_payment_failed`。
5. 签名校验：LemonSqueezy 使用 `X-Signature` header（HMAC-SHA256 of raw body + `LEMONSQUEEZY_WEBHOOK_SECRET`）。
6. 用户切换入口：`/account/billing` 显示「使用 LemonSqueezy 结算」按钮（仅当用户 country_code ∈ {CN, CU, IR, RU, KP, SY} 或 detection failed 时默认显示）。
7. 字段映射文档化：LS `meta.custom_data` ↔ Paddle `passthrough`；LS `attributes.total` ↔ Paddle amount。
8. 退款入口在 13-7 由 admin 操作 → 调 LS Refund API；LS 也通过 `order_refunded` webhook 触发反向。

## Tasks / Subtasks

- [ ] **后端接口**（AC: 1,2）
  - [ ] `apps/api/src/routes/payments/lemonsqueezy.ts`
  - [ ] 创建 LS checkout via API（custom_data 携带 order_id）

- [ ] **Products 同步脚本**（AC: 1）
  - [ ] `scripts/payment/sync-lemonsqueezy-products.ts`

- [ ] **前端切换入口**（AC: 3,6）
  - [ ] `apps/app/src/features/payment/PaymentVendorSwitcher.tsx`
  - [ ] country_code 检测 + localStorage 偏好

- [ ] **Webhook + handlers**（AC: 4,5）
  - [ ] `apps/api/src/routes/webhooks/lemonsqueezy.ts`
  - [ ] `packages/payment/lemonsqueezy/verify-signature.ts`
  - [ ] handlers 复用 13-3 事件总线 emit `order.paid` / `order.refunded`

- [ ] **字段映射工具**（AC: 7）
  - [ ] `packages/payment/lemonsqueezy/normalize.ts`：把 LS payload 归一化到内部 PaymentEvent 类型

## Dev Notes

### 关键约束
- LS hosted checkout 不支持嵌入弹窗，只能跳转。
- LS 货币结算可能与 Paddle 不一致（LS USD-only 结算，本地货币展示），`amount_local_cents` 由 LS 提供 `display_total`。
- 同一用户允许在不同时间使用不同 vendor，但同一 active subscription 不可跨 vendor 迁移。

### 关联后续 stories
- 13-2 fallback 触发本入口
- 13-3 webhook 总线统一
- 13-7 refund 兼容 LS

### Project Structure Notes
- `apps/api/src/routes/payments/lemonsqueezy.ts`
- `apps/api/src/routes/webhooks/lemonsqueezy.ts`
- `packages/payment/lemonsqueezy/`
- `apps/app/src/features/payment/PaymentVendorSwitcher.tsx`
- `.env`：`LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_WEBHOOK_SECRET`, `LEMONSQUEEZY_STORE_ID`

### References
- `planning/epics/13-payment.md` ZY-13-04
- LemonSqueezy API: https://docs.lemonsqueezy.com/api

### 测试标准
- 集成：LS sandbox 创建 checkout → 跳转 → success
- Webhook：order_created 与 Paddle transaction.completed 落到同样的 `payment_orders.status=paid`

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

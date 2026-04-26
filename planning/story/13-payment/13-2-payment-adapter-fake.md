# ZY-13-02 · PaymentAdapter 接口 + FakeProvider

> Epic：E13 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `packages/adapters` 增加 `PaymentAdapter` 接口：`createCheckout(planId, userId) -> {checkoutUrl, orderId}`、`getOrder(orderId)`、`refund(orderId)`、`subscribe(orderId, callbacks)`、`notifyOrderSuccess(orderId)`
- [ ] `FakeProvider`：内存 / DB sandbox；`/api/v1/dev/payment/sandbox?order=<id>` 一键确认成功 / 退款（仅 dev）
- [ ] 事件总线：BE 内部 emit `order.succeeded` / `order.refunded`；E12 入账、E14 佣金订阅消费
- [ ] 工厂：`PAYMENT_PROVIDER` 默认 `fake`
- [ ] **PR 检查**：禁止 import paddle/lemonsqueezy/stripe SDK

## 测试方法
- 单元：接口契约 + 事件 emit
- MCP Puppeteer：sandbox 页一键确认 → entitlements 出现

## DoD
- [ ] 缺真实 key 自动 fake；FE 无感

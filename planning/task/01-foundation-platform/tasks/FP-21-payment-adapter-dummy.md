# FP-21 · 实现 PaymentAdapter Dummy

## 原文引用

- `planning/spec/02-tech-stack.md`：“支付 | PaymentAdapter | dummy（直接成功）| Paddle / 微信支付。”
- `planning/rules.md`：“本期不集成任何外部托管 SaaS。”

## 需求落实

- 页面：无。
- 组件：PaymentAdapter interface、DummyPaymentAdapter。
- API：供 PY 模块创建 checkout、fake webhook、退款、取消订阅。
- 数据表：`orders`、`user_subscriptions`、`webhook_events` 由 PY 模块实现。
- 状态逻辑：dummy checkout 直接成功或返回本地 fake checkout URL，不调用真实支付。

## 技术假设

- 业务契约保留订单、权益、退款、分销反向逻辑。
- 外部 Paddle/LemonSqueezy 字段仅为未来映射，不在 dev 真实连接。

## 不明确 / 风险

- 风险：PRD 写真实 Paddle，但铁律禁止外部 SaaS。
- 处理：本任务不降级业务流程，只替换外部执行层为 dummy。

## 最终验收清单

- [ ] 无支付 key 时可完成 fake checkout。
- [ ] fake webhook 支持幂等测试。
- [ ] 不发生真实网络支付调用。

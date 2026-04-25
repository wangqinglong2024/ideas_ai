# Story 13 索引 · 支付与订阅（Payment & Subscription）

> Epic：[E13 Payment](../../epics/13-payment.md) · Sprint：[S13](../../sprint/13-payment.md) · 阶段：M5 · 周期：W27-W30

## Story 列表

| Story | 标题 | 状态 |
|---|---|---|
| [13-1](./13-1-plans-subscriptions-orders-tables.md) | plans / subscriptions / payment_orders 表 | ready-for-dev |
| [13-2](./13-2-paddle-checkout-integration.md) | Paddle 集成 + Checkout | ready-for-dev |
| [13-3](./13-3-paddle-webhook.md) | Paddle Webhook | ready-for-dev |
| [13-4](./13-4-lemonsqueezy-backup.md) | LemonSqueezy 备份集成 | ready-for-dev |
| [13-5](./13-5-plan-selection-ui.md) | 套餐选择 UI | ready-for-dev |
| [13-6](./13-6-subscription-management.md) | 订阅管理（个人页） | ready-for-dev |
| [13-7](./13-7-refund-flow.md) | 退款流程 | ready-for-dev |
| [13-8](./13-8-coupon-system.md) | 优惠券系统 v1 | ready-for-dev |
| [13-9](./13-9-renewal-reminders.md) | 续费提醒 | ready-for-dev |
| [13-10](./13-10-financial-reconciliation.md) | 财务对账 | ready-for-dev |

## DoD
- 支付链路全跑通（Paddle + LemonSqueezy 双链）
- 退款 + 续费 + 取消 + 升降级 OK
- 财务对账每日自动 + 差异告警
- 退款触发 commission_reversed（联通 S14）

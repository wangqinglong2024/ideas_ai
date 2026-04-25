# Sprint S13 · 支付与订阅（Payment & Subscription）

> Epic：[E13](../epics/13-payment.md) · 阶段：M5 · 周期：W27-W30 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-13)

## Sprint 目标
Paddle 主 + LemonSqueezy 备的 MoR 支付；月 / 年 / 终身订阅；知语币充值；退款 + 续费 + 取消。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 13-1-plans-subscriptions-orders-tables | 表 + 索引 + RLS | M | S01 | W27 |
| 2 | 13-2-paddle-checkout-integration | Paddle Checkout | L | 13-1 | W27-W28 |
| 3 | 13-3-paddle-webhook | Paddle Webhook | L | 13-2 | W28 |
| 4 | 13-5-plan-selection-ui | 套餐选择 UI | M | 13-2,S04 | W28 |
| 5 | 13-4-lemonsqueezy-backup | LemonSqueezy 备份 | M | 13-2 | W29 |
| 6 | 13-6-subscription-management | 订阅管理（个人页） | L | 13-3 | W29 |
| 7 | 13-8-coupon-system | 优惠券系统 | M | 13-2 | W29 |
| 8 | 13-7-refund-flow | 退款流程 | M | 13-3,S12,S14 | W30 |
| 9 | 13-9-renewal-reminders | 续费提醒 | S | 13-6 | W30 |
| 10 | 13-10-financial-reconciliation | 财务对账 | L | 13-3,S17 | W30 |

## 风险
- Paddle 国家限制 → LemonSqueezy 兜底自动切换
- Webhook 延迟 / 丢失 → 主动轮询补偿（每 6h）

## DoD
- [ ] 支付链路全跑通（Paddle + LemonSqueezy 双链）
- [ ] 退款 + 续费 + 取消 + 升降级 OK
- [ ] 财务对账每日自动 + 差异告警
- [ ] 退款触发 commission_reversed（联通 S14）
- [ ] retrospective 完成

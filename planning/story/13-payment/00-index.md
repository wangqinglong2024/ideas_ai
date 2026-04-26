# Story Index · E13 支付与订阅

> 顶层约束：[planning/00-rules.md](../../00-rules.md)。Story 数量按需 6。一律走 PaymentAdapter，**不**直接 import paddle/lemonsqueezy/stripe SDK。

| ID | 标题 | 估 | 状态 |
|---|---|---|---|
| [ZY-13-01](./13-1-tables-plans-orders.md) | plans / subscriptions / payment_orders / entitlements 表 | M | ready-for-dev |
| [ZY-13-02](./13-2-payment-adapter-fake.md) | PaymentAdapter 接口 + FakeProvider | L | ready-for-dev |
| [ZY-13-03](./13-3-pricing-checkout.md) | 套餐选择 UI + Checkout | M | ready-for-dev |
| [ZY-13-04](./13-4-subscription-mgmt-coupon.md) | 订阅管理 + 退款 + 优惠券 | L | ready-for-dev |
| [ZY-13-05](./13-5-renewal-grace.md) | 续费提醒 + grace period | S | ready-for-dev |
| [ZY-13-06](./13-6-finance-reconciliation.md) | 财务对账视图（后台） | M | ready-for-dev |

Epic：[../../epics/13-payment.md](../../epics/13-payment.md)

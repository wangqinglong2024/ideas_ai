# Epic E13 · 支付与订阅（Payment & Subscription）

> 阶段：M5 · 优先级：P0 · 估算：3 周（缩减后）
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)
>
> **范围调整**：本期不引入 Paddle / LemonSqueezy 等真实 MoR，全部走 `PaymentAdapter` 抽象 + fake provider。真实集成由用户在后续阶段自行处理（不在 planning 范围）。

## 摘要
统一 PaymentAdapter 抽象 + sandbox/fake provider；月 / 年 / 终身订阅；ZC 充值；对账与退款流程。

## 范围
- `plans` / `subscriptions` / `payment_orders` / `entitlements` 表
- `PaymentAdapter` 接口 + `FakePaymentProvider`
- 套餐选择 UI、订阅管理、退款流程、续费提醒
- 后台对账视图

## 非范围（明确移交用户后续）
- Paddle / LemonSqueezy 真实 SDK 与 webhook
- 银联 / 支付宝 / 微信
- 发票

## Stories（按需 6）

### ZY-13-01 · plans / subscriptions / payment_orders / entitlements 表
**AC**
- [ ] schema `zhiyu` 四表 + 索引 + RLS
- [ ] `entitlements` 用于课程 / 章节解锁判定
**估**：M

### ZY-13-02 · PaymentAdapter 接口 + FakePaymentProvider
**AC**
- [ ] 接口：`createCheckout(planId, userId) → {checkoutUrl, orderId}`、`getOrder(orderId)`、`refund(orderId)`、`subscribe(orderId, callbacks)`、`notifyOrderSuccess(orderId)`
- [ ] FakeProvider：内存 / DB sandbox；`/api/v1/dev/payment/sandbox?order=` 一键确认成功 / 退款（仅 dev）
- [ ] 事件总线：`order.succeeded` / `order.refunded` 由 BE 内部 emit；订阅消费（E12 入账、E14 佣金）
**估**：L

### ZY-13-03 · 套餐选择 UI + Checkout
**AC**
- [ ] 月 / 年 / 终身价目；推荐徽章；本地化货币（接 E04）
- [ ] 调 `createCheckout`；fake 模式下跳沙盒确认页
**估**：M

### ZY-13-04 · 订阅管理 + 退款 + 优惠券
**AC**
- [ ] 个人页：当前订阅 / 取消 / 升降级 / 过期提醒
- [ ] 后台发起退款 → emit `order.refunded` → 反向佣金 + ZC 回收
- [ ] 简单折扣码 `coupons` 表
**估**：L

### ZY-13-05 · 续费提醒 + grace period
**AC**
- [ ] 到期前 7d / 1d 通过 EmailAdapter（fake 输出 console）+ supabase-realtime 站内通知
- [ ] 失败续费 grace 3 天
**估**：S

### ZY-13-06 · 财务对账视图（后台）
**AC**
- [ ] 每日订单聚合：成交 / 退款 / 净额
- [ ] CSV 导出
- [ ] 真实供应商接入后此视图复用（接口预留）
**估**：M

## DoD
- [ ] PaymentAdapter 抽象通；FakeProvider 全链路 OK
- [ ] 订阅 / 退款 / 优惠券 / 提醒 跑通
- [ ] 不直接 import paddle / lemonsqueezy / stripe SDK

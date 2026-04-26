# ZY-14-06 · 佣金计算（PaymentAdapter 事件 → pending）

> Epic：E14 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 订阅 / 一次性付款 `order.succeeded`（来自 E13）触发
- [ ] `amount_coins = round(order_amount_usd × 100 × 0.20)`（L1 = 20%、L2 = 20%）
- [ ] L1 / L2 分别 INSERT pending；幂等 (order_id, level) 唯一
- [ ] `order.refunded` 触发 `reverseCommission`
- [ ] 单户年 commission 上限 200,000 ZC

## 测试方法
- 集成：fake order.succeeded → 两条 pending；重复 emit 不重复
- 退款 → 反向

## DoD
- [ ] 幂等 + 年上限

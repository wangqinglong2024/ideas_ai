# ZY-13-01 · plans / subscriptions / payment_orders / entitlements 表

> Epic：E13 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`plans`、`subscriptions`、`payment_orders`、`entitlements`
- [ ] 索引 + RLS（本人可读）
- [ ] `entitlements` 用于课程 / 章节解锁判定
- [ ] `payment_orders` 字段：provider / provider_order_id / amount_usd_cents / status / metadata jsonb

## 测试方法
- migration 通过；并发 RLS 验证

## DoD
- [ ] 4 表 + RLS 落地

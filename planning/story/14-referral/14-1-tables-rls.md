# ZY-14-01 · referral_codes / relations / commissions 表 + RLS

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`referral_codes`、`referral_relations`、`referral_commissions`
- [ ] 索引 (l1_user_id)、(l2_user_id)、(order_id, level) 唯一
- [ ] RLS：仅本人可查 commissions / relations
- [ ] `referral_commissions.amount_coins` INT（单位 ZC）
- [ ] **不创建** `referral_withdrawals` / `referral_balances`（永久禁用现金提现）

## 测试方法
- migration 通过
- RLS 验证：A 不可见 B 的 commissions

## DoD
- [ ] 三表 + RLS；旧两表不存在

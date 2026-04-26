# ZY-12-01 · coins_balances / ledger 表

> Epic：E12 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`coins_balances`、`coins_ledger`
- [ ] RLS（本人可读）
- [ ] ledger amount INT（可负）+ 触发器维护 `balance_after`
- [ ] 唯一索引 (user_id, idem_key)
- [ ] `economy.issue / spend / refund` service 函数（pg function 或 BE 服务）

## 测试方法
- migration；并发 100 spend 验证余额一致

## DoD
- [ ] 两表 + service 函数

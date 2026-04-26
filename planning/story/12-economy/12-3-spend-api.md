# ZY-12-03 · 消耗 API + 幂等

> Epic：E12 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] POST `/api/v1/coins/spend` body: `{amount, reason, idem_key}`
- [ ] 余额校验；事务锁（FOR UPDATE）
- [ ] 幂等键唯一；重复请求返回原结果
- [ ] 退款 `/api/v1/coins/refund/:ledger_id` → 反向写入

## 测试方法
- 集成：并发 spend；重复请求；退款不重复

## DoD
- [ ] 幂等 + 并发安全

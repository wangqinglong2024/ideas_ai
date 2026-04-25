# Story 12.3: 消耗 API + 幂等

Status: ready-for-dev

## Story

作为 **业务模块开发者**，
我希望 **统一的 spend API 处理消耗、幂等、退款**，
以便 **课程 / 小说 / 商城 / 道具购买全部走同一通路**。

## Acceptance Criteria

1. `POST /v1/coins/spend` body：`{ amount, reason, ref_type, ref_id, idempotency_key }`。
2. 校验：amount > 0；balance ≥ amount；用户未冻结。
3. 事务：写 ledger（delta = -amount）→ 触发器更新 balance；返回 `{ balance_after, ledger_id }`。
4. 幂等：`idempotency_key` 唯一；命中时返回 200 + 原结果，不重复扣。
5. 余额不足返回 402 + `{ code: 'insufficient_balance', balance, required }`。
6. 冻结用户返回 403 + `{ code: 'account_frozen' }`（12-10）。
7. 退款 `POST /v1/coins/refund` body：`{ ledger_id, reason }`：仅服务内/管理员调用，写正向 ledger 并 ref 原 id。
8. 限流：60 req/min/user；审计日志。

## Tasks / Subtasks

- [ ] spend route + service（AC: 1-6,8）
- [ ] refund route（AC: 7）
- [ ] 幂等中间件（AC: 4）
- [ ] 限流（AC: 8）
- [ ] 单元 / 集成测试（含并发幂等 / 余额竞态）

## Dev Notes

### 关键约束
- 并发：使用 PG 行级锁 `SELECT ... FOR UPDATE` 保证余额一致。
- spend 必须在事务内调触发器；不可绕过。

### Project Structure Notes
- `apps/api/src/routes/coins-spend.ts`
- `apps/api/src/services/coins/spend.ts`
- `apps/api/src/services/coins/refund.ts`

### References
- [Source: planning/epics/12-economy.md#ZY-12-03]

### 测试标准
- 单元：余额边界 / 幂等
- 集成：并发压测 100 QPS 无超扣

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

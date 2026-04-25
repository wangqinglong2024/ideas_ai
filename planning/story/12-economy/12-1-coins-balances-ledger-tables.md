# Story 12.1: coins_balances / coins_ledger 表

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立用户知语币余额与流水表，支撑获得 / 消耗 / 退款全链路**，
以便 **所有币变动可追溯、余额一致**。

## Acceptance Criteria

1. `coins_balances(user_id PK, balance int >= 0, frozen int >= 0, updated_at)`，每用户 1 行。
2. `coins_ledger(id PK, user_id FK, delta int (+/-), reason text, source enum [lesson|article|game|checkin|invite|recharge|spend|refund|admin|other], ref_type, ref_id, balance_after int, created_at, idempotency_key unique nullable)`。
3. 触发器：插入 ledger 时根据 delta 更新 `coins_balances` 并设置 `balance_after`，事务内校验 `balance >= 0`，否则报错回滚。
4. 唯一约束：`coins_ledger.idempotency_key` 唯一（针对 spend / recharge 防重复）。
5. 索引：`coins_ledger(user_id, created_at desc)`、`coins_ledger(source, created_at desc)`。
6. RLS：用户仅可读自身记录；服务端写入。
7. Migration 包含数据回填脚本（首次创建无需）。
8. 性能：单用户最近 100 条流水查询 P95 < 50ms。

## Tasks / Subtasks

- [ ] schema + migration（AC: 1,2,5）
- [ ] 触发器（AC: 3,4）
- [ ] RLS（AC: 6）
- [ ] 索引验证（AC: 8）
- [ ] 单元测试：余额负数拒绝 / 触发器一致性

## Dev Notes

### 关键约束
- 严禁应用层算 `balance_after`，必须 DB 触发器内计算。
- `frozen` 字段用于 12-10 反作弊冻结，不可负。

### Project Structure Notes
- `packages/db/schema/coins.ts`
- `packages/db/migrations/<ts>__coins.sql`

### References
- [Source: planning/epics/12-economy.md#ZY-12-01]
- [Source: planning/spec/05-data-model.md § 4.11]

### 测试标准
- 单元 / 集成：触发器 + RLS

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

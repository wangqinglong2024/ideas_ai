# Story 1.10: 数据库 Mock Adapter

Status: done

## Story

As a 开发者,
I want 数据库访问先具备 mock adapter,
so that 缺少真实数据库密钥时 API readiness 与测试不被阻断。

## Acceptance Criteria

1. `packages/db` 提供 `createDatabaseClient()`。
2. `mock://supabase` 自动进入 mock 模式。
3. `ready()` 返回 `ReadinessResult`。
4. `query()` 在 mock 模式返回空 rows 与 sql 回显。
5. API `/ready` 包含 database 检查。

## Tasks / Subtasks

- [x] Task 1: DB package（AC: #1, #2, #3, #4）
  - [x] `packages/db/src/index.ts`
  - [x] DB tests
- [x] Task 2: API readiness（AC: #5）
  - [x] `/ready` database check

## Dev Notes

- 文件名保留历史 story key，但不创建外部数据库项目。
- 真实数据库接入留给后续 Epic，在 E01 只做 adapter 边界。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Database mock adapter implemented.

### Completion Notes List

- Replaced external database initialization with mock adapter boundary.
- `mock://supabase` enters mock mode and returns readiness without credentials.
- API readiness includes database check result.

### File List

- `packages/db/package.json`
- `packages/db/src/index.ts`
- `packages/db/src/index.test.ts`
- `apps/api/src/server.ts`
- `vitest.config.ts`

### Change Log

- 2026-04-25: Implemented database mock adapter and readiness integration.

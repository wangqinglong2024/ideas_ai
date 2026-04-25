# Story 1.7: 环境变量与密钥 Mock 策略

Status: done

## Story

As a 开发者,
I want 所有环境变量集中读取并支持缺失密钥 mock fallback,
so that 没有密码或 API Key 时测试与体验仍能继续。

## Acceptance Criteria

1. `packages/config` 提供 `loadConfig()`。
2. 缺失 `DATABASE_URL`、`DATABASE_SERVICE_KEY`、`REDIS_URL` 时记录到 `missingSecrets`。
3. 缺失值使用 `mock://*` 或 mock key 默认值。
4. `.env.example` 与 `.env.docker.example` 覆盖必要变量。
5. API `/ready` 可展示 missingSecrets。

## Tasks / Subtasks

- [x] Task 1: Config package（AC: #1, #2, #3）
  - [x] `packages/config/src/index.ts`
  - [x] Config tests
- [x] Task 2: Env examples（AC: #4）
  - [x] `.env.example`
  - [x] `.env.docker.example`
- [x] Task 3: Ready integration（AC: #5）
  - [x] API `/ready` 输出缺失项

## Dev Notes

- 文件名保留历史 story key，但不再使用任何外部 secrets 平台。
- 需要真实密钥时只在 env 示例中声明变量名，不阻断测试。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Mock-first config implemented.

### Completion Notes List

- Replaced external secrets platform scope with centralized mock-first config.
- Missing database/Redis secrets are recorded and default to mock values.
- `/ready` includes missing secret names and adapter readiness.

### File List

- `packages/config/package.json`
- `packages/config/src/index.ts`
- `packages/config/src/index.test.ts`
- `.env.example`
- `.env.docker.example`
- `apps/api/src/server.ts`

### Change Log

- 2026-04-25: Implemented environment loading and missing-secret mock fallback.

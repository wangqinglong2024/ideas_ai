# Story 1.6: API Runtime

Status: done

## Story

As a 开发者,
I want API 与 Worker 在 Docker 中可构建、可运行、可测试,
so that 后续业务 API 能复用统一 runtime 基线。

## Acceptance Criteria

1. `apps/api` 构建为 Node runtime。
2. `GET /` 返回 ok payload。
3. `GET /health` 返回 `ServiceHealth` JSON。
4. `GET /ready` 返回 database/queue readiness 与 mock/real 模式。
5. `POST /v1/events` 接收本地 analytics 事件。
6. `apps/worker` 可执行 demo job。

## Tasks / Subtasks

- [x] Task 1: API service（AC: #1, #2, #3, #4, #5）
  - [x] `apps/api/package.json`
  - [x] `apps/api/src/server.ts`
  - [x] API tests
- [x] Task 2: Worker service（AC: #6）
  - [x] `apps/worker/src/index.ts`
  - [x] Worker tests
- [x] Task 3: Runtime Docker target（AC: #1）
  - [x] `Dockerfile` runtime target

## Dev Notes

- 不依赖 Express 或第三方 API 框架，先使用 Node HTTP 降低依赖面。
- 错误处理走本地 observability。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- API/Worker runtime implemented.

### Completion Notes List

- Added Node HTTP API runtime with health, readiness, config and event endpoints.
- Added worker demo job path with local queue adapter.
- Added tests for health/readiness, analytics events and malformed request error handling.

### File List

- `apps/api/package.json`
- `apps/api/src/server.ts`
- `apps/api/src/server.test.ts`
- `apps/worker/package.json`
- `apps/worker/src/index.ts`
- `apps/worker/src/index.test.ts`
- `Dockerfile`

### Change Log

- 2026-04-25: Implemented API and worker runtime with Docker build target.

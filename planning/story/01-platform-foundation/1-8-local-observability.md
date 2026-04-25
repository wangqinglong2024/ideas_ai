# Story 1.8: 本地 Observability

Status: done

## Story

As a 开发者,
I want 本地 JSON logger 与错误捕获桩,
so that 没有第三方观测服务时也能测试错误路径和诊断信息。

## Acceptance Criteria

1. `packages/observability` 提供 `createLogger()`。
2. `captureError()` 返回本地 eventId。
3. API 捕获异常并返回 `internal_error` 与 eventId。
4. 单元测试覆盖 logger 与 error capture。
5. 不上传 sourcemap，不创建外部 alert。

## Tasks / Subtasks

- [x] Task 1: Observability package（AC: #1, #2, #4）
  - [x] `packages/observability/src/index.ts`
  - [x] Observability tests
- [x] Task 2: API error integration（AC: #3）
  - [x] API 捕获错误并记录本地 eventId
- [x] Task 3: 去第三方依赖（AC: #5）
  - [x] 不引入外部 SDK

## Dev Notes

- 文件名保留历史 story key，但故事内容已替换为本地 observability。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Local observability implemented.

### Completion Notes List

- Replaced external error tracking with local JSON logger and error capture.
- API returns `internal_error` with local event id on handled exceptions.
- Added package tests and API malformed request coverage.

### File List

- `packages/observability/package.json`
- `packages/observability/src/index.ts`
- `packages/observability/src/index.test.ts`
- `apps/api/src/server.ts`
- `apps/api/src/server.test.ts`

### Change Log

- 2026-04-25: Implemented local observability and API error integration.

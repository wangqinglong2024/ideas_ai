# Story 1.9: 本地 Analytics

Status: done

## Story

As a 开发者,
I want 本地 analytics store,
so that 事件埋点路径可测试且不需要外部分析平台授权。

## Acceptance Criteria

1. `packages/analytics` 提供 `createAnalyticsStore()`。
2. 支持 `track()` 与 `identify()`。
3. API `POST /v1/events` 接收事件并返回 202。
4. 单元测试覆盖本地事件写入。
5. 不需要外部项目 key、source token 或仪表板。

## Tasks / Subtasks

- [x] Task 1: Analytics package（AC: #1, #2, #4）
  - [x] `packages/analytics/src/index.ts`
  - [x] Analytics tests
- [x] Task 2: API events endpoint（AC: #3）
  - [x] `POST /v1/events`
- [x] Task 3: 去第三方依赖（AC: #5）
  - [x] 不引入外部 SDK

## Dev Notes

- 文件名保留历史 story key，但故事内容已替换为本地 analytics。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Local analytics implemented.

### Completion Notes List

- Replaced external analytics/logging scope with local analytics store.
- API `POST /v1/events` persists events in the local store for testability.
- No external project key or source token is required.

### File List

- `packages/analytics/package.json`
- `packages/analytics/src/index.ts`
- `packages/analytics/src/index.test.ts`
- `apps/api/src/server.ts`
- `apps/api/src/server.test.ts`

### Change Log

- 2026-04-25: Implemented local analytics and API event endpoint.

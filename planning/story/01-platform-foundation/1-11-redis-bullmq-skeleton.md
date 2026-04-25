# Story 1.11: 队列 Mock Adapter 与 Worker

Status: done

## Story

As a 开发者,
I want 本地队列 adapter 与 Worker demo job,
so that 没有 Redis 密钥或队列服务时仍可验证后台任务链路。

## Acceptance Criteria

1. `packages/jobs` 提供 `createJobQueue()`。
2. 支持 `enqueue()`、`drain()`、`ready()`。
3. `mock://redis` 自动进入 mock 模式。
4. `apps/worker` 可处理 demo job。
5. Docker Compose 提供 Redis 容器，但 mock 模式不依赖它。
6. API `/ready` 包含 queue 检查。

## Tasks / Subtasks

- [x] Task 1: Jobs package（AC: #1, #2, #3）
  - [x] `packages/jobs/src/index.ts`
  - [x] Jobs tests
- [x] Task 2: Worker demo（AC: #4）
  - [x] `apps/worker/src/index.ts`
  - [x] Worker tests
- [x] Task 3: Compose Redis 与 ready（AC: #5, #6）
  - [x] `docker-compose.yml` Redis service
  - [x] API `/ready` queue check

## Dev Notes

- 文件名保留历史 story key，但不依赖外部 Redis 服务或队列平台。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Queue mock adapter and worker implemented.

### Completion Notes List

- Replaced external Redis/BullMQ dependency with queue adapter boundary and mock mode.
- Worker demo enqueues and drains a local job.
- Docker Compose includes Redis for preview while mock mode remains independent.

### File List

- `packages/jobs/package.json`
- `packages/jobs/src/index.ts`
- `packages/jobs/src/index.test.ts`
- `apps/worker/src/index.ts`
- `apps/worker/src/index.test.ts`
- `docker-compose.yml`
- `apps/api/src/server.ts`
- `vitest.config.ts`

### Change Log

- 2026-04-25: Implemented queue mock adapter, worker demo and readiness integration.

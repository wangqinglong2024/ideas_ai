# Story 1.11: Redis (Upstash) + BullMQ 骨架

Status: ready-for-dev

## Story

As a 开发者,
I want Upstash Redis (Singapore) 与 BullMQ 队列骨架就位,
so that 后续 Epic 可以将异步 job（邮件 / TTS / 评分 / cron）直接注入到统一队列。

## Acceptance Criteria

1. Upstash 创建 2 个 Redis 数据库：`zhiyu-staging-redis`、`zhiyu-prod-redis`，Singapore region，持久化（AOF）启用。
2. dev 环境使用本地 Docker Redis 7.x（`docker-compose.yml` 提供）。
3. 应用接入 `ioredis`（BullMQ 要求），连接字符串通过 Doppler 注入。
4. `apps/worker` 集成 BullMQ：定义 `defaultQueue` + 1 个示例 queue `demo`（处理 `demo.echo` job）。
5. 提供 producer 工具（`packages/sdk/queue.ts`）：类型安全的 `enqueue(queueName, jobName, payload)`。
6. 失败重试：默认 `attempts: 3, backoff: { type: 'exponential', delay: 1000 }`；死信入 `dead-letter` queue。
7. 健康检查：`/ready`（在 1.6 中）需检查 Redis ping 成功；BullMQ worker 暴露内部 metrics（job 处理速率 / 失败率）。
8. 监控：BullMQ Dashboard（@bull-board/express）挂在 `apps/api` 的 `/internal/queues`，仅管理员（Basic Auth + IP 白名单）可访问。
9. 提供 1 个 demo cron job：每小时打印 alive 日志（验证 cron 调度可用）。
10. 单元测试：producer 类型安全测试 + worker 处理 demo job 的集成测试（用 ioredis-mock 或本地 redis）。

## Tasks / Subtasks

- [ ] Task 1: Upstash 实例（AC: #1）
- [ ] Task 2: 本地 Redis（AC: #2）
  - [ ] `docker-compose.yml`：redis 7.x + 端口 6379
  - [ ] README 写明 `pnpm dev:redis`
- [ ] Task 3: 客户端封装（AC: #3, #5）
  - [ ] `packages/sdk/redis.ts`
  - [ ] `packages/sdk/queue.ts` 类型安全 enqueue
- [ ] Task 4: BullMQ worker（AC: #4, #6, #9）
  - [ ] `apps/worker/src/queues/demo.ts`
  - [ ] cron job 用 BullMQ `repeat`
- [ ] Task 5: 健康 / 监控（AC: #7, #8）
  - [ ] `/ready` 加 redis ping
  - [ ] bull-board 集成 + Basic Auth + IP 白名单
- [ ] Task 6: 测试（AC: #10）

## Dev Notes

### 关键
- Upstash REST API 不适配 BullMQ（需 TCP），采购 plan 必须含 TCP（Standard 起）
- bull-board 路径走内部 prefix `/internal/queues`，CSP 与 18-3 协调
- 死信队列由各业务 worker 各自定义（在此仅占位）

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-11](../../epics/01-platform-foundation.md)
- [Source: planning/spec/04-backend.md#§-5](../../spec/04-backend.md)
- [Source: planning/sprint/01-platform-foundation.md#W3](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

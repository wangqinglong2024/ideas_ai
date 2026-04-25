# Story 19.1: Pino 日志 + Better Stack 接入

Status: ready-for-dev

## Story

作为 **后端工程师 / SRE**，
我希望 **API 与 Worker 全部使用 Pino 输出结构化 JSON 日志，并实时投递到 Better Stack（Logtail）**，
以便 **统一字段、PII 脱敏、热查询 30 天 + 归档 365 天，所有线上问题可一键溯源**。

## Acceptance Criteria

1. 所有服务（apps/api / apps/worker / apps/admin SSR）统一用 `@/logger` 导出的 Pino 实例，禁止 `console.log`（ESLint rule 强制）。
2. 标准字段：`ts / level / service / env / version / trace_id / span_id / user_id / request_id / message / context`，所有 HTTP 入口中间件自动注入 `trace_id` / `request_id` / `user_id`。
3. **PII 脱敏中间件**：`password / token / authorization / cookie / card_no / cvv / id_card / phone / email` 字段自动替换为 `***`，含 nested 路径；单元测试覆盖 50+ 字段案例。
4. 生产用 `pino-pretty=false` + 直接 stdout；本地 dev 用 `pino-pretty`。
5. Better Stack 通过 Render log drain（HTTPS Source）接入，**保留 30d 热 + 365d R2 归档**（每日 cron 导出 JSON.gz）。
6. 日志级别 env 化：`LOG_LEVEL=info`（prod）/ `debug`（preview）/ `trace`（local）。
7. 错误对象自动展平：`err.message / err.stack / err.code / err.cause`；不丢栈。
8. 关键事件最小集：`http_request / http_response / job_started / job_completed / job_failed / payment_event / ai_call`，每个事件名固定（不允许散落字符串）。
9. 单元 + 集成测试：脱敏 / 字段完整 / drain 投递（mock）。

## Tasks / Subtasks

- [ ] **Logger 包**（AC: 1, 2, 4, 6, 7）
  - [ ] `packages/logger/src/index.ts`：base + child logger
  - [ ] `packages/logger/src/middleware.ts`：Hono / Express / BullMQ wrapper
  - [ ] env schema 校验
- [ ] **PII 脱敏**（AC: 3）
  - [ ] redact paths + `pino` `redact` 配置
  - [ ] 自定义 `serializers` 兜底
  - [ ] 50+ 单测
- [ ] **Drain / 归档**（AC: 5）
  - [ ] Render dashboard 配置 Better Stack source（infra/docs）
  - [ ] `apps/cron/jobs/log-archive.ts`：每日导出 → R2 `logs/yyyy/mm/dd/`
- [ ] **事件枚举**（AC: 8）
  - [ ] `packages/logger/src/events.ts`：联合类型 + payload schema
- [ ] **ESLint rule**（AC: 1）
  - [ ] `no-console` error；exception 仅 scripts
- [ ] **测试**（AC: 9）

## Dev Notes

### 关键约束
- **不可** 在日志里放整段 prompt / response；只放 hash + length；防止成本爆炸 + PII。
- `user_id` 必须是内部 uuid，**不可**写邮箱 / 手机；登录链路前用 `anon_<sessionId>`。
- BullMQ job log 走 child logger `{ job_id, queue }`；与 HTTP request_id 不同字段。
- Better Stack 免费额度有限：生产 sample 1.0，preview 0.3，dev stdout only。

### 关联后续 stories
- 19-2 Sentry：trace_id 与 Sentry transaction 关联（W3C traceparent）
- 19-4 metrics：log volume 也作为 SLI
- 19-9 备份：归档 R2 走相同 bucket

### Project Structure Notes
- `packages/logger/`
- `apps/api/src/middleware/logging.ts`
- `apps/cron/jobs/log-archive.ts`
- `infra/render.yaml`（log drain url 不入仓，仅环境变量）

### References
- [planning/epics/19-observability.md ZY-19-01](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 1, § 3](../../spec/10-observability.md)

### 测试标准
- 单元：脱敏字段矩阵 + 错误展平
- 集成：HTTP 请求一次完整 log payload 断言
- 安全：grep `password|cvv|cookie` 输出零命中

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

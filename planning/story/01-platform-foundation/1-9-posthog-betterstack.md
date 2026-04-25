# Story 1.9: PostHog + Better Stack 接入

Status: ready-for-dev

## Story

As a 开发者,
I want PostHog 行为埋点 + Better Stack 日志聚合接入到全部前后端服务,
so that 产品 / 运营可以分析用户漏斗，工程可以聚合查询日志并配置告警。

## Acceptance Criteria

1. PostHog SDK：前端 `posthog-js`、后端 `posthog-node`，均通过 Doppler 注入 `POSTHOG_KEY` 与 host（`https://app.posthog.com` 或 EU 实例）。
2. 前端：登录后 `posthog.identify(userId, { country, locale, plan })`；登出后 `posthog.reset()`。
3. 前端：autocapture 关闭，仅显式 `capture(eventName, props)`；事件命名规范 `domain.action`（snake_case 或 dot），统一在 `packages/analytics` 提供类型化封装。
4. 后端：服务端事件（payment_succeeded / refund_processed 等）通过 `posthog-node` 上报，含 distinctId = userId。
5. Better Stack（Logtail）：Pino transport `@logtail/pino`，日志 JSON 输出，含字段 `service env version traceId userId`。
6. 日志级别：dev=debug, staging=info, prod=info；error/fatal 同时上报 Sentry 与 Better Stack。
7. PII 脱敏中间件：`email phone token authorization cookie set-cookie` 字段统一打码，单元测试覆盖 ≥ 5 案例。
8. PostHog 创建 3 个仪表板模板（已 fixture）：`acquisition`、`activation`、`monetization`。
9. Better Stack 创建 source 与默认 view，30 天热数据 + 365 天归档。
10. CI 不上报真实事件：通过 `POSTHOG_DISABLED=true` 环境变量短路。

## Tasks / Subtasks

- [ ] Task 1: packages/analytics（AC: #1, #2, #3, #4）
  - [ ] 抽象 `analytics.capture(name, props)` 类型安全（事件 union 类型）
  - [ ] FE / BE 各自适配
- [ ] Task 2: 日志 transport（AC: #5, #6, #7）
  - [ ] `apps/api/src/lib/logger.ts` 用 pino
  - [ ] `pino-pretty` for dev；`@logtail/pino` for staging/prod
  - [ ] redact paths：`req.headers.authorization`、`*.password`、`*.token` 等
- [ ] Task 3: 仪表板与 source（AC: #8, #9）
  - [ ] dashboard JSON 导入到 `tools/posthog-dashboards/*.json`
  - [ ] Better Stack source token 走 Doppler
- [ ] Task 4: CI 隔离（AC: #10）

## Dev Notes

### 关键
- PostHog 自托管 vs Cloud：v1 选 Cloud（成本可控），v1.5 评估自托管
- 事件 schema 文档由 `packages/analytics/events.ts` 单一来源（DRY）
- distinctId 在登录前用匿名 UUID（localStorage），登录后 alias 关联

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-09](../../epics/01-platform-foundation.md)
- [Source: planning/spec/10-observability.md#§-3-§-10](../../spec/10-observability.md)
- [Source: planning/sprint/01-platform-foundation.md#W4](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

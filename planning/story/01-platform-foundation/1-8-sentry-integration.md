# Story 1.8: Sentry FE/BE 接入

Status: ready-for-dev

## Story

As a 开发者,
I want 前端 / 后端均集成 Sentry 并上传 source map、绑定 release，
so that 线上异常能快速定位到具体源文件 / 函数 / 用户上下文，缩短 MTTR。

## Acceptance Criteria

1. `apps/app` 与 `apps/admin` 集成 `@sentry/react`，启用 BrowserTracing + Replay（采样率 10% / 错误时 100%）。
2. `apps/api` 与 `apps/worker` 集成 `@sentry/node`，使用 `Sentry.setupExpressErrorHandler()` 与 `nodeProfilingIntegration`（v1 关闭 profiling，预留 hook）。
3. CI 在 build 后自动上传 source map 至 Sentry（仅 staging/prod，PR preview 不传），并删除 dist 中的 `*.map`。
4. 每次部署创建 Sentry release：`zhiyu-{service}@{version}`，version = `git rev-parse --short HEAD`。
5. release 关联 commits（`sentry-cli releases set-commits --auto`）。
6. 自定义 `beforeSend`：脱敏 PII（email / phone / token），过滤已知噪音错误（ResizeObserver loop / 取消的 Promise）。
7. 自定义 fingerprint 规则：相同业务错误（如 `Payment.declined`）按 `{type, code}` 聚合而非堆栈。
8. 用户上下文：登录后 `Sentry.setUser({id, country})`（不传 email/name）。
9. 全局未捕获异常 + Promise rejection 100% 上报；预期业务异常（4xx）不上报。
10. Sentry 仪表板创建 4 个 alerts：`error rate > 1%/5min`、`new issue`、`P95 transaction > 1s`、`session crash rate > 1%`。

## Tasks / Subtasks

- [ ] Task 1: FE 集成（AC: #1, #6, #7, #8）
  - [ ] `apps/app/src/lib/sentry.ts` 初始化
  - [ ] `apps/admin` 同
  - [ ] beforeSend + fingerprint 实现
- [ ] Task 2: BE 集成（AC: #2, #6, #7, #9）
  - [ ] `apps/api/src/lib/sentry.ts`
  - [ ] Express middleware 注册顺序：requestHandler → 业务 → tracingHandler → errorHandler
  - [ ] worker 同上（无 express，用 `Sentry.captureException` 包裹 job runner）
- [ ] Task 3: source map 上传（AC: #3, #4, #5）
  - [ ] `sentry-cli` 在 `release.yml` 中调
  - [ ] `--validate` 校验 source map
  - [ ] 删除 `dist/**/*.map`（生产）
- [ ] Task 4: alerts（AC: #10）
  - [ ] dashboard 配置 4 个 alert rules
  - [ ] 告警通道：Slack `#alerts`

## Dev Notes

### 关键
- Sentry DSN 通过 Doppler 注入（前端走 `VITE_SENTRY_DSN`）
- Replay 仅启用 console + network breadcrumb，DOM mask 默认（PII 防泄漏）
- traceSampleRate 0.1（v1），后续按业务量调
- 不上报 4xx：`if (error.statusCode && error.statusCode < 500) return null;`

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-08](../../epics/01-platform-foundation.md)
- [Source: planning/spec/10-observability.md#§-2](../../spec/10-observability.md)
- [Source: planning/sprint/01-platform-foundation.md#W3](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

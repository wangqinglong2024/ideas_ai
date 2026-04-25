# Story 19.2: Sentry FE/BE 完整集成

Status: ready-for-dev

## Story

作为 **全栈工程师**，
我希望 **前端（web / admin / 营销站）和后端（api / worker）完整集成 Sentry，包括 source map、release 标记、用户 fingerprint 与自定义过滤**，
以便 **所有运行时错误第一时间可见、可追溯，并能与日志、PostHog 互联**。

## Acceptance Criteria

1. 项目分组：`web` / `admin` / `marketing` / `api` / `worker` 5 个独立 project；DSN 通过 env 注入，不入仓。
2. **Source map** 自动上传：CI 在 build 后用 `@sentry/cli releases files upload` 上传；release 名 `${app}@${git_sha}`；上传后从 dist 删除（不上线）。
3. **Release tracking**：每次部署 `sentry-cli releases new/finalize/deploys`；与 Render deploy webhook 联动（19-10）。
4. **用户 fingerprint**：登录后 `Sentry.setUser({ id, locale, country })`；登出 `setUser(null)`；**不传** email / phone。
5. **自定义过滤**（`beforeSend`）：
   - 已知第三方扩展错误（fingerprint 列表）→ ignore
   - 网络错误 sample 10%
   - 4xx（业务错误）默认 ignore，仅 5xx + 未捕获异常上报
   - PII 兜底：扫描 `event.request.data` 删除黑名单字段
6. **Performance**：FE traces sample 0.1（生产）/ 1.0（preview）；BE 0.2 / 1.0；Replay sample 0.1 + onError 1.0。
7. **告警集成**：Sentry → Slack `#alerts-error`；新 issue + 高频 issue（>10/5min）→ PagerDuty（19-6）。
8. 单元 + 集成测试：beforeSend filter 矩阵；source map 上传 dry-run；React ErrorBoundary 兜底。

## Tasks / Subtasks

- [ ] **SDK 初始化**（AC: 1, 4, 6）
  - [ ] `packages/observability/src/sentry-fe.ts` / `sentry-be.ts`
  - [ ] Next.js `instrumentation.ts` + `sentry.client.config.ts`
  - [ ] Hono / Worker 初始化
- [ ] **Source map + Release**（AC: 2, 3）
  - [ ] CI workflow `.github/workflows/release.yml` 注入 `SENTRY_AUTH_TOKEN`
  - [ ] `pnpm sentry:upload` 脚本 per-app
- [ ] **Filter / Fingerprint**（AC: 4, 5）
  - [ ] `beforeSend` 共享逻辑
  - [ ] PII redact list（与 19-1 共用）
- [ ] **告警**（AC: 7）
  - [ ] Slack integration
  - [ ] PagerDuty rule（19-6 编排）
- [ ] **测试**（AC: 8）
  - [ ] 模拟错误事件矩阵
  - [ ] ErrorBoundary 截图

## Dev Notes

### 关键约束
- **绝不**把 DSN 编码在前端 bundle 之外；DSN 公开但 auth_token 严禁泄漏。
- traces sample > 0.2 会爆 quota；需在 19-1 metrics 监控 sentry monthly events。
- `user_id` 与 19-1 一致使用内部 uuid，方便日志 / Sentry / PostHog 三向 join。
- W3C `traceparent` header：FE → API → Worker 全链路传递；Sentry 自动 propagate。
- FE 版本号 `process.env.NEXT_PUBLIC_GIT_SHA` 必须在 `next.config.js` 显式 expose。

### 关联后续 stories
- 19-1：trace_id 关联 + redact 共享
- 19-6：Sentry → PagerDuty
- 19-10：release/deploy webhook

### Project Structure Notes
- `packages/observability/src/{sentry-fe,sentry-be,filters,types}.ts`
- `apps/web/instrumentation.ts`
- `apps/api/src/sentry.ts`
- `.github/workflows/release.yml`

### References
- [planning/epics/19-observability.md ZY-19-02](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 2, § 5.2](../../spec/10-observability.md)

### 测试标准
- 单元：beforeSend 矩阵（已知扩展 / 网络 sample / 4xx ignore）
- 集成：触发未捕获异常 → Sentry dashboard 验证（preview env）
- 安全：event payload PII 字段为空

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

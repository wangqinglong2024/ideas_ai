# Story 19.4: /health /ready /metrics 端点

Status: ready-for-dev

## Story

作为 **SRE / 运维**，
我希望 **API 服务暴露统一的 /health、/ready、/metrics 端点**，
以便 **Render 健康探测、外部状态页拨测以及 Prometheus 指标抓取均可一站接入**。

## Acceptance Criteria

1. `GET /health`：200 OK，返回 `{ status:'ok', service:'api', version, uptime_s, ts }`，**不依赖外部资源**（用于 liveness）。
2. `GET /ready`：依次检查 Postgres（`SELECT 1`）/ Redis（`PING`）/ R2（HEAD bucket）/ 关键第三方（Stripe / DeepSeek 占位 healthz），任一失败返回 503，body 列出失败项；超时 2s 单项；total ≤ 3s。
3. `GET /metrics`：Prometheus text 格式，仅在内网 / Render private network 可访问（IP allowlist + `X-Internal-Token` 双校验），暴露 `request_count`、`request_duration_seconds{quantile=...}`、`error_count`、`db_pool_in_use`、`queue_depth`、`cache_hit_rate`。
4. Render `render.yaml` healthCheckPath 指向 `/ready`；docker / fly 同步配置。
5. 端点全链路打 trace（Sentry txn 名 `health.*`），但不写业务日志（避免噪声）；失败时 ERROR 级日志 + Sentry。
6. 单元测试：mock 各依赖失败覆盖 `/ready` 的 503 分支；集成测试：真实拉起依赖一次过通。

## Tasks / Subtasks

- [ ] **Schema / 中间件**（AC: 1, 2）
  - [ ] `apps/api/src/routes/system/health.ts`
  - [ ] `apps/api/src/routes/system/ready.ts`：依赖检查清单可配置（env `READY_CHECKS=db,redis,r2,stripe`）
- [ ] **Metrics**（AC: 3）
  - [ ] 引入 `prom-client`，全局 Histogram / Counter
  - [ ] `apps/api/src/routes/system/metrics.ts` + 内网鉴权中间件
  - [ ] HTTP 请求耗时直方图中间件（label：method / route / status）
- [ ] **Render 配置**（AC: 4）
  - [ ] `infra/render.yaml` healthCheckPath=/ready
  - [ ] 文档：本地 `pnpm dev` 端口 / 内网 token 配置
- [ ] **可观测**（AC: 5）
  - [ ] Sentry transaction filter（health/ready 不计入 apdex 但保留失败）
  - [ ] log skip filter
- [ ] **测试**（AC: 6）
  - [ ] 单元：依赖失败矩阵
  - [ ] 集成：docker compose 拉起后 200/503 双路径

## Dev Notes

### 关键约束
- `/health` 必须 < 50ms，**不可**做任何 IO；用于 Render liveness（10s 间隔）。
- `/ready` 用于负载均衡摘流；初次部署 Render 60s 内必须能 200。
- `/metrics` **绝不可公网暴露**：双层（CIDR + token），并在 Better Stack 内网拨测。
- 所有端点禁用 auth 中间件但开启 rate limit（防扫描）：100 rps 单 IP。
- `version` 来自 `process.env.GIT_SHA`（CI 注入）。

### 关联后续 stories
- 19-1 Pino：注入 `request_id` 到 `/metrics` label
- 19-6 告警：基于 `up{service="api"}=0` 触发
- 19-7 状态页：拨测 `/ready`

### Project Structure Notes
- `apps/api/src/routes/system/{health,ready,metrics}.ts`
- `apps/api/src/middleware/metrics.ts`
- `apps/api/src/middleware/internal-only.ts`
- `infra/render.yaml`

### References
- [planning/epics/19-observability.md ZY-19-04](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 6](../../spec/10-observability.md)

### 测试标准
- 单元：每依赖一条失败用例
- 集成：docker compose 一次性 200
- 安全：`/metrics` 无 token 返回 401，公网 IP 返回 403

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

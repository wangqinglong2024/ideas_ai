# Epic E19 · 可观测与运维（Observability & Ops）

> 阶段：M0-M6 贯穿 · 优先级：P0 · 估算：3 周（分散）
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)
>
> **全栈自建**：禁用 Sentry / PostHog / Better Stack / Logtail / PagerDuty / Datadog 等 SaaS。本 dev 周期日志走 docker 文件 + pino，指标走 prom-client `/metrics` 端点，告警走 cron + EmailAdapter（fake）。

## 摘要
日志 / 指标 / 错误追踪 / 行为埋点 / 健康检查 / 备份 全栈自建，配 supabase Studio + 简单 admin 仪表板。

## Stories（按需 8）

### ZY-19-01 · pino 日志 + Docker 落盘
**AC**
- [ ] 结构化 JSON；脱敏中间件（密码 / token / 手机）
- [ ] zhiyu-api / zhiyu-worker / zhiyu-admin-be 三服务统一格式
- [ ] docker volume 挂载到宿主 `/var/log/zhiyu/`，`logrotate` 模板（用户自启）
**估**：M

### ZY-19-02 · 自建错误追踪表 `zhiyu.error_events`
**AC**
- [ ] FE 全局 errorBoundary + window.onerror → POST `/api/v1/_telemetry/error`
- [ ] BE express error middleware → 写 `error_events`
- [ ] 字段：ts、env=dev、release、user_id、url、message、stack、context jsonb
- [ ] dedup 指纹（hash(message+stack 前 3 行)）
**估**：M

### ZY-19-03 · 行为埋点 `zhiyu.events` + 数据 SDK
**AC**
- [ ] FE `useEvent` hook + auto pageview；BE 服务端事件
- [ ] `/api/v1/_telemetry/event` 批量；events 表分区（按月）
- [ ] 文档：事件 schema yaml 在 `_bmad/`（非必须）
**估**：L

### ZY-19-04 · /healthz /readyz /metrics
**AC**
- [ ] 检查 supabase / Redis / 关键 Adapter（fake → ok）
- [ ] prom-client `/metrics` Prometheus 格式；可被宿主 Prometheus（用户自启）抓
**估**：S

### ZY-19-05 · 业务指标仪表板（admin）
**AC**
- [ ] admin 内 `/admin/ops` 页：实时（注册 / 付费 / 在线）+ 工厂任务 + 客服 SLA
- [ ] 数据走 supabase RPC + `events` 聚合
**估**：M

### ZY-19-06 · 告警规则 + 通道
**AC**
- [ ] BullMQ repeatable cron 扫 `error_events` 增量、`/healthz` 异常
- [ ] 触发 → EmailAdapter（fake → console；后续接真实）
- [ ] 告警阈值与静默窗口配置写 DB
**估**：M

### ZY-19-07 · Web Vitals RUM + 部署事件
**AC**
- [ ] FE 上报 LCP / INP / CLS 到 `events`；admin 仪表板按页面 / 设备
- [ ] 部署时 `pnpm release:mark` 写 `releases` 表 + emit event
**估**：M

### ZY-19-08 · 备份与恢复演练
**AC**
- [ ] supabase pg_dump daily cron（worker 容器内）→ 写到宿主 `/opt/backups/supabase/<ts>/`
- [ ] supabase-storage 全量同步到 `/opt/backups/storage/`
- [ ] runbook md：恢复步骤 + 季度演练记录模板（参考 `/opt/backups/supabase/20260426-105954/RESTORE.md`）
**估**：M

## DoD
- [ ] 三件套（日志 / 错误 / 埋点）全自建落地
- [ ] 仪表板可看；告警 fake 通
- [ ] 备份脚本在 zhiyu-worker 容器内每日跑
- [ ] 不引用任何监控 SaaS

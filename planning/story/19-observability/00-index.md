# Story Index · E19 可观测与运维（Observability & Ops）

> Epic：[E19](../../epics/19-observability.md) · Sprint：[S19](../../sprint/19-observability.md)
> 阶段：**M0-M6 贯穿** · 优先级：P0 · 估算：4 周（分散）
> Story 数：10

## 排期说明
- **M0 必备**：19-4（health/ready/metrics）→ 19-1（Pino 日志）→ 19-2（Sentry）
- **M1-M2**：19-3（PostHog 行为埋点） + 19-8（Web Vitals RUM）
- **M3**：19-6（告警） + 19-7（状态页）
- **M4-M5**：19-5（业务仪表板） + 19-10（部署事件 + PIR）
- **M5-M6**：19-9（备份恢复演练）

## Story 列表

| 序 | Story Key | 标题 | 估 | 阶段 |
|:-:|---|---|:-:|:-:|
| 1 | [19-4-health-ready-metrics](./19-4-health-ready-metrics.md) | /health /ready /metrics 端点 | S | M0（W3）|
| 2 | [19-1-pino-logging-betterstack](./19-1-pino-logging-betterstack.md) | Pino 日志 + Better Stack | M | M0（W4）|
| 3 | [19-2-sentry-fe-be-integration](./19-2-sentry-fe-be-integration.md) | Sentry FE/BE 集成 | M | M0（W4）|
| 4 | [19-3-posthog-event-tracking](./19-3-posthog-event-tracking.md) | PostHog 行为埋点 | L | M1-M2 |
| 5 | [19-8-web-vitals-rum](./19-8-web-vitals-rum.md) | Web Vitals RUM | M | M2 |
| 6 | [19-6-alerts-rules-channels](./19-6-alerts-rules-channels.md) | 告警规则 + 通道 | M | M3 |
| 7 | [19-7-status-page](./19-7-status-page.md) | status.zhiyu.io 状态页 | M | M3 |
| 8 | [19-5-business-metrics-dashboard](./19-5-business-metrics-dashboard.md) | 业务指标仪表板 | M | M4-M5 |
| 9 | [19-10-deployment-events-postmortem](./19-10-deployment-events-postmortem.md) | 部署事件 + Postmortem | S | M5 |
| 10 | [19-9-backup-recovery-drill](./19-9-backup-recovery-drill.md) | 备份与恢复演练 | M | M5-M6 |

## 依赖
- E01 平台基建：服务骨架 / Render 配置 / R2 已就绪
- E13 支付：支付失败率告警依赖支付事件
- E15 客服：SLA 指标
- E16 工厂：成本 / 任务成功率指标
- E17 admin：业务仪表板入口

## 风险
- **告警噪音** → 调阈值；首月 weekly review；静默规则
- **监控成本** → PostHog / Sentry / Better Stack 采样 + 配额
- **PII 泄漏** → 日志脱敏中间件 + Sentry beforeSend 双重过滤
- **备份未验证** → 季度演练 runbook 强制执行

## DoD
- [ ] 三件套全集成（Sentry / PostHog / Better Stack）
- [ ] SLO 监控启用（API uptime ≥ 99.9% / P95 < 300ms）
- [ ] PagerDuty + Slack 告警有效（无误报 1 周）
- [ ] status.zhiyu.io 公开 + 订阅
- [ ] 季度备份恢复演练 runbook + 一次成功演练
- [ ] retrospective 完成

## 参考
- [planning/spec/10-observability.md](../../spec/10-observability.md)
- [planning/spec/07-integrations.md § 10 PostHog](../../spec/07-integrations.md)
- [planning/prds/01-overall](../../prds/01-overall/)

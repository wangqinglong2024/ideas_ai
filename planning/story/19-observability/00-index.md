# Story Index · E19 可观测与运维

> 顶层约束：[planning/00-rules.md](../../00-rules.md)。Story 数量按需 8。**禁用 Sentry / PostHog / Better Stack / Logtail / PagerDuty / Datadog**。日志走 docker 文件 + pino，指标走 prom-client。

| ID | 标题 | 估 | 状态 |
|---|---|---|---|
| [ZY-19-01](./19-1-pino-logs-docker.md) | pino 日志 + Docker 落盘 | M | ready-for-dev |
| [ZY-19-02](./19-2-error-events-table.md) | 自建错误追踪表 error_events | M | ready-for-dev |
| [ZY-19-03](./19-3-events-table-sdk.md) | 行为埋点 events + 数据 SDK | L | ready-for-dev |
| [ZY-19-04](./19-4-health-metrics.md) | /healthz /readyz /metrics | S | ready-for-dev |
| [ZY-19-05](./19-5-business-dashboard.md) | 业务指标仪表板（admin） | M | ready-for-dev |
| [ZY-19-06](./19-6-alerts.md) | 告警规则 + 通道 | M | ready-for-dev |
| [ZY-19-07](./19-7-web-vitals-rum.md) | Web Vitals RUM + 部署事件 | M | ready-for-dev |
| [ZY-19-08](./19-8-backup-restore.md) | 备份与恢复演练 | M | ready-for-dev |

Epic：[../../epics/19-observability.md](../../epics/19-observability.md)

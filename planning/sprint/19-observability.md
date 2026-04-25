# Sprint S19 · 可观测与运维（Observability & Ops）

> Epic：[E19](../epics/19-observability.md) · 阶段：M0-M6 贯穿 · 优先级：P0 · 估算：4 周分散
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-19)

## Sprint 目标
日志 / 错误 / 行为 / 健康 / 业务指标 / 告警 / 状态页 / RUM / 备份 / 部署事件 全链路覆盖。

## Story 列表与阶段绑定

| 序 | Story Key | 估 | 阶段 |
|:-:|---|:-:|:-:|
| 1 | 19-4-health-ready-metrics | S | M0（W3）|
| 2 | 19-1-pino-logging-betterstack | M | M0（W4）|
| 3 | 19-2-sentry-fe-be-integration | M | M0（W4）|
| 4 | 19-3-posthog-event-tracking | L | M1-M2 |
| 5 | 19-8-web-vitals-rum | M | M2 |
| 6 | 19-6-alerts-rules-channels | M | M3 |
| 7 | 19-7-status-page | M | M3 |
| 8 | 19-5-business-metrics-dashboard | M | M4-M5 |
| 9 | 19-10-deployment-events-postmortem | S | M5 |
| 10 | 19-9-backup-recovery-drill | M | M5-M6 |

## 风险
- 告警噪音 → 调阈值；首月 weekly review
- 监控成本 → PostHog / Sentry / Better Stack 采样 + 配额

## DoD
- [ ] 三件套全集成（Sentry / PostHog / Better Stack）
- [ ] SLO 监控启用（API uptime ≥ 99.9% / P95 延迟）
- [ ] PagerDuty + Slack 告警有效
- [ ] status.zhiyu.io 公开 + 订阅
- [ ] 季度备份恢复演练 runbook
- [ ] retrospective 完成

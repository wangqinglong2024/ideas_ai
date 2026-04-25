# Story 15 索引 · 客服 IM 与工单（Customer Service）

> Epic：[E15 Customer Service](../../epics/15-customer-service.md) · Sprint：[S15](../../sprint/15-customer-service.md) · 阶段：M6 · 周期：W33-W36

## Story 列表

| Story | 标题 | 状态 |
|---|---|---|
| [15-1](./15-1-cs-tables-rls.md) | conversations / messages / tickets / faq 表 + RLS | ready-for-dev |
| [15-2](./15-2-websocket-gateway.md) | WS 网关（Socket.io+Redis） | ready-for-dev |
| [15-3](./15-3-agent-dispatch-service.md) | 派单服务 + 转接 | ready-for-dev |
| [15-4](./15-4-user-im-ui.md) | 用户端 IM UI | ready-for-dev |
| [15-5](./15-5-agent-im-workbench.md) | 客服后台 IM 工作台 | ready-for-dev |
| [15-6](./15-6-ticket-flow.md) | 工单流（提交 / 分类 / 派单） | ready-for-dev |
| [15-7](./15-7-faq-self-service.md) | FAQ 自助 | ready-for-dev |
| [15-8](./15-8-ai-assist-v1.md) | AI 辅助（FAQ 匹配 + 建议） | ready-for-dev |
| [15-9](./15-9-offline-fallback-email.md) | 离线邮件兜底 | ready-for-dev |
| [15-10](./15-10-cs-sla-dashboard.md) | SLA 仪表板 | ready-for-dev |

## DoD
- IM 实时通畅（P95 < 500ms）
- 派单 + 转接 + 升级 OK
- FAQ 命中率 ≥ 60%（首月数据）
- SLA 监控（响应 / 时长 / 满意度）

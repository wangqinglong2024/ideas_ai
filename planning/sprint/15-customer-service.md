# Sprint S15 · 客服 IM 与工单（Customer Service）

> Epic：[E15](../epics/15-customer-service.md) · 阶段：M6 · 周期：W33-W36 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-15)

## Sprint 目标
内嵌 IM 客服 + 工单系统 + FAQ；多客服派单；离线邮件兜底。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 15-1-cs-tables-rls | 表 + RLS | M | S01 | W33 |
| 2 | 15-2-websocket-gateway | WS 网关（Socket.io+Redis） | L | S01,15-1 | W33-W34 |
| 3 | 15-3-agent-dispatch-service | 派单服务 + 转接 | L | 15-2 | W34 |
| 4 | 15-4-user-im-ui | 用户端 IM UI | L | 15-2,S05 | W34-W35 |
| 5 | 15-5-agent-im-workbench | 客服后台工作台 | L | 15-2,S17 | W35 |
| 6 | 15-6-ticket-flow | 工单流（提交 / 分类 / 派单） | M | 15-1 | W35 |
| 7 | 15-7-faq-self-service | FAQ 自助 | M | 15-1,S04 | W35 |
| 8 | 15-9-offline-fallback-email | 离线邮件兜底 | S | 15-3 | W36 |
| 9 | 15-8-ai-assist-v1 | AI 辅助（FAQ 匹配 + 建议） | M | 15-7 | W36 |
| 10 | 15-10-cs-sla-dashboard | SLA 仪表板 | M | 15-3,S19 | W36 |

## 风险
- 客服资源不足 → AI 辅助 + FAQ 引导优先
- 多语客服培训 → 内部知识库 4+1 语

## DoD
- [ ] IM 实时通畅（P95 < 500ms）
- [ ] 派单 + 转接 + 升级 OK
- [ ] FAQ 命中率 ≥ 60%（首月数据）
- [ ] SLA 监控（响应 / 时长 / 满意度）
- [ ] retrospective 完成

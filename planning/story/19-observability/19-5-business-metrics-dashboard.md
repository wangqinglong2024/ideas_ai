# Story 19.5: 业务指标仪表板

Status: ready-for-dev

## Story

作为 **创始人 / 产品 / 运营 / 客服主管**，
我希望 **拥有一个统一的实时业务仪表板，覆盖注册 / 付费 / 在线 / 工厂任务 / 客服 SLA**，
以便 **每日 standup、决策、上线日（20-10）作战指挥都有同一数据源**。

## Acceptance Criteria

1. 主载体：Better Stack 仪表板（生产）+ Metabase（v1.5 BI）；MVP 阶段先 Better Stack 嵌入 admin。
2. **核心面板**：
   - **实时**：当前在线 / 5min 注册 / 5min 付费金额 / API uptime 30d
   - **学习**：DAU / 课程节完成数（24h）/ 平均 streak / 每节平均得分
   - **商业**：付费用户数 / MRR / ARPU / 退款率 / 渠道分布
   - **工厂**：任务进行中 / 失败率 / 当月成本（按 channel）
   - **客服**：开 ticket 数 / 中位响应时间 / SLA 命中率
3. **数据源**：PostHog（业务事件）/ Postgres 直连（应用表）/ Stripe API（财务）/ Better Stack metrics。
4. **刷新**：实时面板 60s；统计面板 5min；财务 1h。
5. **权限**：admin RBAC `analytics:read`（创始人 / PM / Ops / CS Lead）；`analytics:export`（CFO）。
6. **导出**：CSV / PDF（每日 09:00 自动邮件给关键人）。
7. **嵌入**：admin `/admin/dashboard` 默认页（替代 v0 静态卡片）。
8. **数据正确性**：每个指标关联一条 SQL 或 PostHog Insight，并有单元测试 fixture（含 0 / 边界）。

## Tasks / Subtasks

- [ ] **数据层**（AC: 3, 8）
  - [ ] `packages/analytics-sql/`：所有指标的 SQL（命名 + 单测）
  - [ ] PostHog Insight JSON `infra/posthog/insights/`
- [ ] **聚合 API**（AC: 4）
  - [ ] `apps/api/src/routes/admin/dashboard/*.ts`
  - [ ] Redis 缓存（实时 60s / 统计 5min / 财务 1h）
- [ ] **UI**（AC: 1, 2, 7）
  - [ ] `apps/admin/src/pages/dashboard/`
  - [ ] 卡片组件 + 折线 + 漏斗（recharts / tremor）
- [ ] **权限**（AC: 5）
  - [ ] `analytics:read` / `analytics:export` 接入 E17 RBAC
- [ ] **导出**（AC: 6）
  - [ ] cron 09:00 PDF / CSV → 邮件（resend）
- [ ] **嵌入 BS**（AC: 1）
  - [ ] BetterStack iframe + signed url
- [ ] **测试**（AC: 8）
  - [ ] SQL fixture 单测
  - [ ] E2E 仪表板渲染

## Dev Notes

### 关键约束
- **金额数字**必须以最小货币单位（cents）存与计算，前端格式化；单测覆盖 0.01 边界。
- Postgres 直连用 read replica（如有），否则 master 限 SELECT；超 1s 查询告警。
- 所有指标统一时区 UTC，UI 按用户 locale 渲染（默认 Asia/Singapore）。
- 任何字段口径变更走 RFC（docs/rfc/dashboard-metrics.md）。

### 关联后续 stories
- 19-3：PostHog 数据源
- 19-6：异常指标触发告警
- 20-10：D-day 作战指挥屏

### Project Structure Notes
- `packages/analytics-sql/`
- `apps/api/src/routes/admin/dashboard/`
- `apps/admin/src/pages/dashboard/`
- `apps/cron/jobs/dashboard-export.ts`

### References
- [planning/epics/19-observability.md ZY-19-05](../../epics/19-observability.md)
- [planning/spec/10-observability.md § 4.2, § 9.2](../../spec/10-observability.md)

### 测试标准
- 单元：每 SQL fixture 0 / 1 / 大数据 三组
- 集成：admin 登录 → 仪表板 200 + 数据非 NaN
- 性能：所有 API < 300ms p95（含缓存）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

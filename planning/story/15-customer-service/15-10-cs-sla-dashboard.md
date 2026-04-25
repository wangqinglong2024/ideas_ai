# Story 15.10: 客服 SLA + 仪表板

Status: ready-for-dev

## Story

作为 **客服主管 / 运营**，
我希望 **在 `/admin/cs/dashboard` 实时查看响应时间、会话时长、满意度评分，并按 agent / 时段 / 类别下钻**，
以便 **量化客服质量、分配资源、优化排班**。

## Acceptance Criteria

1. **核心指标**（统计窗口可选 today / 7d / 30d / custom）：
   - **首响时间**（First Response Time, FRT）：用户首条消息 → agent 首条回复 的中位数 / P90。
   - **平均会话时长**：assigned → resolved。
   - **满意度评分（CSAT）**：5 星均值 + 分布 + 评语。
   - **解决率**：resolved / total。
   - **重开率**：closed 后 30 天内重开 / total。
   - **工单 SLA**：按 priority 的按期解决率（low/normal/high/urgent due_at 内）。
   - **AI 采纳率**（来自 15-8）：agent 采纳 AI 建议 / 总建议。
2. **仪表板布局**：
   - 顶部 KPI 卡片（6 个）。
   - 中部 时序曲线（FRT / CSAT trend）。
   - 下部 表格（agent 排行 + 类别分布饼图）。
3. **下钻**：点击 agent → `/admin/cs/agents/:id`：个人 KPI + 最近 50 会话 + AI 反馈。
4. **筛选**：时间范围 / 渠道（im / ticket / email）/ 语言 / 类别。
5. **数据源**：物化视图 `mv_cs_metrics_daily`（每 15min 刷新）+ 实时 delta（最近 30min 实时算）。
6. **告警阈值**（可配）：
   - FRT P90 > 5min → Slack #alerts-cs。
   - CSAT 7d 均值 < 4.0 → 邮件 cs-leads@。
   - SLA 违规率 > 10% → Slack。
7. **导出 CSV**：当前视图导出（≤ 100k 行）。
8. **agent 私有视图**：agent 仅看自己 KPI（受限版仪表板）。
9. **i18n**：dashboard 完全 4 语（admin 可切换）。
10. **性能**：dashboard 首屏 < 1s（物化视图缓存命中）。

## Tasks / Subtasks

- [ ] **物化视图**（AC: 1,5）
  - [ ] `packages/db/views/mv_cs_metrics_daily.sql`
  - [ ] 刷新 cron

- [ ] **dashboard API**（AC: 1,4,5）
  - [ ] `apps/api/src/routes/admin/cs/dashboard.ts`
  - [ ] zod 校验筛选参数

- [ ] **页面 UI**（AC: 2,3,8,9）
  - [ ] `apps/admin/src/routes/cs/dashboard.tsx`
  - [ ] `apps/admin/src/routes/cs/agents/[id].tsx`
  - [ ] recharts / echarts

- [ ] **告警**（AC: 6）
  - [ ] `apps/api/src/crons/cs-sla-alerts.ts`
  - [ ] Slack / email webhook
  - [ ] config 表

- [ ] **CSV 导出**（AC: 7）
  - [ ] streaming response

- [ ] **性能**（AC: 10）

## Dev Notes

### 关键约束
- FRT 计算需排除非工作时段（按 agent timezone 动态）；v1 简化为 24/7。
- CSAT 评语可能含敏感信息：仅 supervisor 角色可见。
- 物化视图刷新失败 → 告警；fallback 实时算（性能下降但不挂）。

### 关联后续 stories
- 15-2 / 15-3 / 15-6 / 15-8 提供原始数据
- E19 observability 共享 Grafana 数据源
- E17 admin RBAC 提供 supervisor 角色

### Project Structure Notes
- `apps/admin/src/routes/cs/dashboard.tsx`
- `apps/api/src/routes/admin/cs/dashboard.ts`
- `apps/api/src/crons/cs-sla-alerts.ts`
- `packages/db/views/mv_cs_metrics_daily.sql`

### References
- `planning/epics/15-customer-service.md` ZY-15-10

### 测试标准
- 单元：FRT / CSAT 计算
- 集成：物化视图 vs 实时一致性
- E2E：筛选 + 下钻 + 导出
- 性能：1M 消息下 P95 < 1s
- 告警：阈值触发 → Slack 收到

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

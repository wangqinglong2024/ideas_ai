# Story 17.11: 报表 / BI 仪表板

Status: ready-for-dev

## Story

作为 **运营 / 高管**，
我希望 **拥有可信的实时仪表板：注册 / 付费 / DAU / 漏斗 / 收入 / 内容产出**，
以便 **数据驱动决策，并支持月度复盘与对外披露**。

## Acceptance Criteria

1. 路由 `/admin/reports`：多 tab（实时 / 漏斗 / 收入 / 内容 / 自定义）。
2. **实时**：注册 / 付费 / DAU / 7d retention / 在线人数；websocket 或 30s 轮询。
3. **漏斗**：注册 → 试听 → 完整体验 → 付费；可按渠道（utm_source）/ 国家细分。
4. **收入**：日 / 周 / 月 / ARPU / LTV / 退款率 / MRR / 渠道贡献。
5. **内容**：发布数（5 类）/ 阅读 / 学习 / 游戏 / 小说 章节；按 published_at 聚合。
6. **CSV / Excel 导出**：所有 tab 当前筛选导出，流式下载。
7. **数据源**：物化视图 `mv_reports_*`（每 5-15min 刷新），避免直查事实表。
8. **权限**：`reports:read|export`；高管 / 财务 / 运营各 role 默认 read。
9. **图表库**：echarts；统一颜色 token（design system）。
10. **可配置**：日期 range / 国家 / channel；筛选 URL 持久化；分享链接。
11. **缓存**：相同筛选 5min 客户端缓存。
12. e2e + 性能测试：仪表板页 P95 < 1.5s。

## Tasks / Subtasks

- [ ] **物化视图**（AC: 7）
  - [ ] mv_reports_realtime / funnel / revenue / content
  - [ ] cron refresh
- [ ] **API**（AC: 1-6, 10）
- [ ] **UI**（AC: 1-5, 9, 10）
  - [ ] echarts components
- [ ] **导出**（AC: 6）
- [ ] **缓存**（AC: 11）
- [ ] **测试**（AC: 12）

## Dev Notes

### 关键约束
- 物化视图刷新 CONCURRENTLY；峰值 5min；非高峰 15min。
- 实时数据源：events 表 + Redis 计数（注册 / 在线 / DAU）；分钟级精度。
- ARPU = 当月收入 / 当月活跃用户；LTV = 历史付费用户平均累计；公式写在 `docs/admin/metrics-definitions.md`。
- 退款率：refunded_amount / gross_amount，按月。
- CSV 导出 streaming，避免 OOM；超 100k 行强制后台异步任务 + 邮件下载链接。
- 数据可信关键：所有口径与 19-5 business-metrics-dashboard 完全一致；定期对账。

### 关联后续 stories
- 17-1 ~ 17-4
- 19-5 business metrics
- 16-12 工厂仪表板（v1.5）

### Project Structure Notes
- `apps/admin/src/pages/reports/`
- `apps/api/src/routes/admin/reports/*.ts`
- `packages/db/migrations/2026xxxx_mv_reports.sql`
- `docs/admin/metrics-definitions.md`

### References
- `planning/epics/17-admin.md` ZY-17-11

### 测试标准
- 性能：mv 命中下 P95 < 1.5s
- 一致性：与 19-5 同字段对比 0 偏差
- e2e：5 tab + 导出

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

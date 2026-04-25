# Story 16.12: 成本 + 质量仪表板

Status: ready-for-dev

## Story

作为 **运营 / 财务 / AI 工程师**，
我希望 **实时查看 AI 工厂的成本与质量指标**，
以便 **预算管控、Prompt 调优与供应商优化决策**。

## Acceptance Criteria

1. 路由 `/admin/factory/dashboard`，仅 `factory:read` 可见。
2. 顶部 KPI 卡片：本月总成本（USD）/ 本月任务数 / 通过率 / 平均评分 / 平均延迟。
3. 图表（默认近 30d，可切换 7d / 90d）：
   - 每日成本（折线，按 channel 堆叠）
   - 每日任务数（柱状，按 status 堆叠）
   - 评分分布直方图（0-1，bin=0.05）
   - 失败原因 top10（柱状）
   - 各 prompt template 成本 / 通过率（表格）
4. **成本预算告警**：env 配置月预算阈值；当月累计 > 80% → 邮件通知；> 100% → 暂停所有新任务（feature flag `factory.global_pause`）。
5. **LangSmith 集成**：可点击任务 ID 跳转 LangSmith trace（前提 trace 已上报）。
6. **数据来源**：聚合 `llm_call_logs` / `tts_call_logs` / `translation_call_logs` / `factory_tasks` / `eval_disputes`，物化视图按日预聚合，避免每次扫表。
7. **筛选**：channel / model / vendor / status / date range；URL query 持久化。
8. **导出**：CSV / Excel 导出当前筛选结果。
9. **延迟 & 误差**：仪表板查询 P95 < 1s（命中物化视图）。
10. **可观察自身**：仪表板 page view 上报 PostHog。
11. 单元 + 集成测试：物化视图刷新作业、KPI 计算正确性、预算告警触发。

## Tasks / Subtasks

- [ ] **物化视图**（AC: 6, 9）
  - [ ] migration `mv_factory_daily_cost` / `mv_factory_daily_quality`
  - [ ] cron 每 15min refresh concurrently
- [ ] **API**（AC: 2, 3, 7, 8）
  - [ ] `apps/api/src/routes/admin/factory/dashboard.ts`
  - [ ] CSV export
- [ ] **UI**（AC: 1-5, 7, 8）
  - [ ] echarts / recharts
  - [ ] LangSmith deep link
- [ ] **预算 + Pause**（AC: 4）
  - [ ] feature flag `factory.global_pause`
  - [ ] 工作流入口检查 flag
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- 物化视图 refresh 不影响线上写入（CONCURRENTLY）。
- 预算告警以 USD 计；汇率取自 17-12 系统设置。
- pause flag 触发：所有 new flow 拒绝（API 返回 503 + 中文提示）；正在跑的 flow 不强行中断。
- LangSmith 链接格式：`https://smith.langchain.com/o/{org}/projects/{proj}/traces/{trace_id}`。
- CSV 导出：流式 server-sent，避免内存占用。

### 关联后续 stories
- 16-2 / 16-3 / 16-8 / 16-9 / 16-10 上报数据
- 17-11 reports-bi（聚合到全公司 BI）
- 19-x observability 告警渠道

### Project Structure Notes
- `apps/admin/src/pages/factory/dashboard/`
- `apps/api/src/routes/admin/factory/dashboard.ts`
- `packages/db/migrations/2026xxxx_factory_mv.sql`
- `apps/api/src/jobs/refresh-factory-mv.ts`

### References
- `planning/epics/16-content-factory.md` ZY-16-12
- `planning/spec/10-observability.md`

### 测试标准
- 单元：KPI 计算（mock 物化视图数据）
- 集成：refresh 作业 → 仪表板数据更新
- 性能：1M llm_call_logs 下查询 P95 < 1s

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

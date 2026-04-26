# ZY-19-05 · 业务指标仪表板（admin）

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] admin `/admin/ops` 页：实时（注册 / 付费 / 在线）+ 工厂任务 + 客服 SLA
- [ ] 数据走 supabase RPC + `events` 聚合
- [ ] 自渲染图（chart.js / echarts）；**不引入** SaaS BI
- [ ] 自动刷新 30s

## 测试方法
- MCP Puppeteer：仪表板渲染 + 数据准确

## DoD
- [ ] 关键 6 指标可见

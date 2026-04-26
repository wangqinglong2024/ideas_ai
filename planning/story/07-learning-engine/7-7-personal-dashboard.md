# ZY-07-07 · 学习数据看板（个人）

> Epic：E07 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 周 / 月报表：时长 / XP / 完成数 / 与上周对比
- [ ] 数据来自 supabase RPC（聚合 `lesson_progress` + `coins_ledger` + `reading_progress`）
- [ ] FE 用 echarts / chart.js 自渲染（不引入 SaaS BI）
- [ ] 支持深色 / 浅色

## 测试方法
- MCP Puppeteer：mock 数据后看板渲染

## DoD
- [ ] 数据准确
- [ ] 不引入 BI SaaS

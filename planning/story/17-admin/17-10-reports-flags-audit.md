# ZY-17-10 · 报表 + 风控信号 + 审计

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 运营 / 安全
**I want** 看 DAU / WAU / 留存 / 收入 / 充值 / 风控信号 / 审计日志
**So that** 全局把握业务与风险。

## 上下文
- 路由 `/admin/reports`、`/admin/security/flags`、`/admin/security/audit`
- 数据：来自 ZY-19-05（business_dashboard）+ fraud_signals + audit_log
- 图表：echarts （本地 npm 包）；不外链

## Acceptance Criteria
- [ ] 报表页：6 卡 + 4 图（DAU/WAU 折线、收入柱、留存 cohort 表、漏斗）
- [ ] 风控信号列表 + 筛选
- [ ] 审计日志 + 全文搜索
- [ ] CSV 导出

## 测试方法
- MCP Puppeteer 三页可见 + 导出

## DoD
- [ ] 数据对得上

## 依赖
- 上游：ZY-19 / ZY-12-08 / ZY-17-01

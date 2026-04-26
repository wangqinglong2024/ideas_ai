# ZY-17-10 · 报表 + Feature Flags + 审计

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 实时仪表板：注册 / 付费 / DAU / WAU
- [ ] 漏斗：注册 → 完成首节 → 首付费
- [ ] 收入按月汇总；CSV 导出
- [ ] Feature Flags：CRUD + 灰度规则（按用户 / 比例）
- [ ] 系统参数：ZC 规则 / 汇率
- [ ] 审计日志查询页（按用户 / 操作类型 / 时间范围）

## 测试方法
- MCP Puppeteer：Flag toggle 后 FE 行为变化
- CSV 下载 + 审计搜索

## DoD
- [ ] 仪表板 + Flags + 审计齐

# ZY-14-09 · 反作弊监控 + 后台审计

> Epic：E14 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 同 IP / 同设备聚集检测；小时级 5×中位数突增告警（写站内 + EmailAdapter fake）
- [ ] admin 后台 suspicious 关系列表 + 冻结操作
- [ ] 冻结后不再 confirm / issue
- [ ] 申诉链接（人工审核流程占位 markdown）
- [ ] 旧 withdraw / regenerate / code 端点 → 404

## 测试方法
- 集成：mock 异常聚集 → 列表显示
- 旧端点 GET → 404

## DoD
- [ ] 风控 + 审计闭环

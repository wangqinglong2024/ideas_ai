# ZY-12-08 · 后台规则配置 + 反作弊

> Epic：E12 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] admin 配置：获得规则 / 单日上限 / 商城价格
- [ ] 审计日志（写入 audit_logs）
- [ ] 异常聚集检测（同 IP / 同设备 5×中位数 → 标 suspicious）
- [ ] 自动冻结账户（`profiles.frozen_at`）+ 人工复核入口

## 测试方法
- 集成：mock 异常聚集 → 标记冻结
- admin UI：规则修改后立即生效

## DoD
- [ ] 配置 + 风控双向通

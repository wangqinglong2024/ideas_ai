# ZY-12-02 · 获得规则引擎

> Epic：E12 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 触发源：节完成 / 文章完成 / 游戏达标 / 签到 / 邀请
- [ ] 规则配置表 `coin_rules(source, amount, daily_cap, enabled)`，admin 可调
- [ ] 单日上限超限丢弃但落 audit
- [ ] 防刷：结合 E18 设备指纹（同设备 / 同 IP 限速）

## 测试方法
- 集成：模拟 50 次同源 → 达 cap 后不再发
- 单元：规则匹配 + audit 写入

## DoD
- [ ] 5 触发源全通；上限有效

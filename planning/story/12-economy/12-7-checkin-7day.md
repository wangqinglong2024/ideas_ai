# ZY-12-07 · 签到 7 天

> Epic：E12 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `checkins(user_id, date, day_in_streak)` 表
- [ ] 每日签到 → ZC 奖励（按天递增）
- [ ] 漏签可补签（消耗 N×ZC）
- [ ] 7 天循环；补签后保持连签

## 测试方法
- 集成：连签 7 天断言奖励
- 边界：跨时区 / 跨日凌晨

## DoD
- [ ] 补签机制 OK

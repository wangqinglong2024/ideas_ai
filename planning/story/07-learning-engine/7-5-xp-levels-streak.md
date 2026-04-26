# ZY-07-05 · XP / 等级 / streak

> Epic：E07 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] XP 公式：节完成 +50、文章读完 +20、游戏达标 +30
- [ ] 等级表 1-100（指数曲线）
- [ ] streak：连续学习天数；每月 1 次免费冻结；漏签 ZC 补签
- [ ] 升级动画 FE 组件
- [ ] 数据：`user_stats(user_id, xp, level, streak, last_active_date, freeze_count)`

## 测试方法
- 集成：连续 7 天 mock → streak=7
- MCP Puppeteer：完成节触发升级动画

## DoD
- [ ] streak 准确（含跨时区边界）

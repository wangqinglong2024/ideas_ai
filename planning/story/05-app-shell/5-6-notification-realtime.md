# ZY-05-06 · 通知中心 + 响应式容器

> Epic：E05 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 通知 sheet：列表、已读 / 未读、类型过滤、单条跳转
- [ ] 数据源：`zhiyu.notifications` 表 + supabase-realtime 频道 `notification:user:<uid>`
- [ ] 顶栏未读红点；点开后批量已读
- [ ] App 容器 query：< 640 / 640-1024 / > 1024 三档

## 测试方法
- 在 supabase Studio INSERT 一条 notifications → FE 实时显示红点
- 不同 viewport 截图验证布局

## DoD
- [ ] 实时通知通
- [ ] 三档响应式正确

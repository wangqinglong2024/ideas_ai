# ZY-15-03 · 用户端 IM UI

> Epic：E15 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 浮动按钮 + drawer 抽屉
- [ ] 文 / 图 / 表情；图片走 supabase-storage `chat/<conv>/<file>`
- [ ] 历史消息分页滚动
- [ ] 订阅 `conv:<id>` 频道 → 实时刷新
- [ ] 草稿本地保存

## 测试方法
- MCP Puppeteer：发文 + 发图 + 收回复
- Storybook：抽屉 / 气泡组件

## DoD
- [ ] 实时 + 媒体 OK

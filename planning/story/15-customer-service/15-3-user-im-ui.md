# ZY-15-03 · 用户端 IM UI

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 在「我 → 客服」打开聊天窗，发文字 / 图片 / 截屏，并能查看历史
**So that** 遇到问题随时找客服。

## 上下文
- 路由 `/support/chat`
- 列表：日期 group + 我 / 客服气泡
- 输入：文本 + 图片（拖拽 / 选择）+ 表情
- 历史：分页加载 + 锚点到未读

## Acceptance Criteria
- [ ] 聊天窗组件（复用未来通用 IM）
- [ ] 图片上传走 storage + 自动压缩 ≤ 1MB
- [ ] 4 语 + RTL
- [ ] 离线 banner（未连 realtime）

## 测试方法
- MCP Puppeteer：发文字 / 发图 / 退出再进 看历史

## DoD
- [ ] UX 流畅
- [ ] 图片预览正常

## 依赖
- 上游：ZY-15-01 / 02

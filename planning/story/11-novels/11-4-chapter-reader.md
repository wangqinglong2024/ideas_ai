# ZY-11-04 · 章节阅读器

> Epic：E11 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 句子级布局：中 / 拼音 / 翻译
- [ ] 翻页模式：上下滚动 / 左右翻页（设置切换）
- [ ] 字号 / 行距 / 主题 / 拼音翻译开关
- [ ] 单字弹窗（复用 ZY-06-04 组件）
- [ ] 进度记忆：书架 + 章内位置（IndexedDB + 服务端同步）

## 测试方法
- MCP Puppeteer：阅读 → 退出 → 重进自动定位
- Storybook：阅读器组件

## DoD
- [ ] 双翻页模式可用

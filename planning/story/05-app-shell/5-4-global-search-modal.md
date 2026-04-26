# ZY-05-04 · 全站搜索 modal（cmdk + FTS）

> Epic：E05 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] cmdk 命令面板（⌘K / 顶栏点击）
- [ ] BE `/api/v1/search?q=` 走 Postgres FTS（接 ZY-06-06 jieba 配置）
- [ ] 多源结果分组：课程 / 文章 / 小说 / 词
- [ ] 历史 + 推荐（最近 10 条 localStorage）
- [ ] 键盘导航 + Enter 跳转

## 测试方法
- MCP Puppeteer：⌘K → 输入 → 选择跳转
- BE 集成：FTS 命中

## DoD
- [ ] 多源命中
- [ ] P95 < 500ms

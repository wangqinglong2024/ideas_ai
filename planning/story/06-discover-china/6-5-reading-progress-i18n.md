# ZY-06-05 · 阅读进度 + 多语切换

> Epic：E06 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 滚动位置每 5s 写入 `reading_progress`
- [ ] 阅读时长累计 → 调 E07 `learningEngine.addReadingTime(userId, articleId, seconds)`
- [ ] 翻译按当前 UI 语言（接 E04 `/api/v1/content/article/:id?lang=`）
- [ ] 切换语言无重载，局部更新句子翻译

## 测试方法
- MCP Puppeteer：阅读 → 退出 → 重进自动滚回
- 切语言：句子翻译 1s 内更新

## DoD
- [ ] 进度准确
- [ ] 切语言无闪烁

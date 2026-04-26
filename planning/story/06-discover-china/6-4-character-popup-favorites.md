# ZY-06-04 · 单字弹窗 + 收藏 / 笔记

> Epic：E06 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 长按 / 双击单字 → popover：拼音 / 释义 / 例句 / 音频（TTSAdapter）
- [ ] 加入生词本 / 加入收藏（写 `vocab_items` / `favorites`）
- [ ] `notes` 表 + 句子级笔记 CRUD
- [ ] `/me/notes` 个人页：分组、搜索

## 测试方法
- 单元：popover 定位边界
- MCP Puppeteer：双击字 → 加入生词 → 个人页可见

## DoD
- [ ] 三表 RLS（仅本人）
- [ ] 弹窗在 iOS Safari 不被遮

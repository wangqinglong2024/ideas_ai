# ZY-11-06 · 书架 + TTS 朗读 + 推荐

> Epic：E11 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 书架：在读 / 已读 / 收藏 三 tab
- [ ] 阅读时长统计调 ZY-07-02 / ZY-06-05 接口
- [ ] TTS 整章连播：调 `TTSAdapter.synthesize`，fake 返回静音 wav；播放器粘附底部
- [ ] 推荐：基于已读分类 SQL 排序（无 ML）

## 测试方法
- MCP Puppeteer：加入书架 → 阅读 → TTS 播放 → 推荐显示

## DoD
- [ ] 不直连真实 TTS

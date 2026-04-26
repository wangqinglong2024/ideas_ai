# ZY-06-03 · 文章详情沉浸阅读 + 音频

> Epic：E06 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 句子级布局：中 / 拼音 / 翻译 三行；可关闭拼音 / 翻译
- [ ] 字号 3 档 + 行距 / 主题切换
- [ ] 句子点击播放、整篇连播、速度 0.75/1/1.25x；当前句高亮
- [ ] 音频 URL 由 `TTSAdapter.synthesize(text, voice)` 提供（fake：返回 `/static/silence-1s.wav` 占位）
- [ ] 播放器粘附底部，可最小化

## 测试方法
- MCP Puppeteer：点击句子触发播放；验证 audio currentTime 增长
- Storybook：阅读器组件 stories

## DoD
- [ ] 体验流畅
- [ ] 不直连任何云 TTS

# ZY-08-05 · 10 种步骤组件

> Epic：E08 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 10 种类型：sentence / word_card / choice / order / match / listen / read / translate / type_pinyin / dialog
- [ ] read 类型走 `ASRAdapter.recognize`（fake：默认通过）
- [ ] listen 类型音频走 `TTSAdapter.synthesize` 或预生成 url
- [ ] 每组件独立 Storybook story
- [ ] 答题数据格式与 ZY-08-01 zod schema 一致

## 测试方法
- 单元：每组件答题正确 / 错误回调
- Storybook：10 个 story 全绿

## DoD
- [ ] 10 组件全可用
- [ ] 不直连真实 ASR/TTS

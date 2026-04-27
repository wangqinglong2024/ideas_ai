# FP-24 · 实现 TTSAdapter Mock

## 原文引用

- `planning/rules.md`：“TTS/ASR/LLM/Agent 调用必须通过 adapter 接口，并默认 fake。”
- `planning/prds/01-overall/04-scope-mvp.md`：“单篇阅读（句子级展示 + 拼音 + 母语 + TTS）。”

## 需求落实

- 页面：DC/CR/NV 播放按钮后续调用音频 URL。
- 组件：TTSAdapter interface、MockTTSAdapter、audio URL resolver。
- API：供内容导入、内容工厂、seed 生成占位音频 URL。
- 数据表：`content_sentences.audio_url` 等由内容模块维护。
- 状态逻辑：mock 返回 `seed://` 或本地 fixture URL，不合成真实音频。

## 技术假设

- 开发 seed 至少部分内容带 TTS 占位 URL。
- 前端播放器能处理 mock 音频不可用/占位状态。

## 不明确 / 风险

- 标注：真实 TTS 暂不支持。
- 处理：播放失败需有 UI fallback，不阻塞阅读。

## 最终验收清单

- [ ] TTSAdapter mock 返回稳定 URL。
- [ ] 缺 TTS key 不影响内容 seed。
- [ ] 前端能显示/处理占位音频。

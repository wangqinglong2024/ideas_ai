# FP-25 · 实现 ASRAdapter Mock

## 原文引用

- `planning/rules.md`：“TTS/ASR/LLM/Agent 调用必须通过 adapter 接口，并默认 fake。”
- `content/course/shared/03-assessment-system.md`：“本平台不为用户跟读做 AI 评分。”

## 需求落实

- 页面：无必需页面。
- 组件：ASRAdapter interface、MockASRAdapter。
- API：预留给未来 ASR 功能，不在 v1 课程评测中调用真实评分。
- 数据表：无。
- 状态逻辑：mock 返回未启用或 fixture，不参与课程通过标准。

## 技术假设

- ASR 作为未来扩展接口存在，当前业务不依赖。
- 课程题型不要求用户录音评分。

## 不明确 / 风险

- 标注：ASR 语音评测暂不支持。
- 处理：任何跟读 UI 只能做自听/播放，不给 AI 分数。

## 最终验收清单

- [ ] ASRAdapter interface 存在。
- [ ] 课程测验不调用 ASR 得分。
- [ ] 缺 ASR key 不影响容器启动。

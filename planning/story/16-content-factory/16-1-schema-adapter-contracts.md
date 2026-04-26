# ZY-16-01 · 表 schema + Adapter 契约

> Epic：E16 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`prompt_templates`、`factory_tasks`、`generations`
- [ ] 索引 + RLS（admin only）
- [ ] `packages/adapters` 增加：
  - `LLMAdapter.generate({prompt, schema?}) / .stream(...)`
  - `TTSAdapter.synthesize({text, locale}) → {url}`（fake 写 `/static/silent.wav`）
  - `ASRAdapter.recognize({audio, locale}) → {text, confidence}`（fake 返回参考文本）
  - `WebSearchAdapter.search({query, locale}) → {results[]}`（fake 返回固定占位）
- [ ] 工厂选择 provider；缺 key 时 fake 自动启用
- [ ] **PR 规则**：禁止 import openai/anthropic/dify/langchain/langgraph

## 测试方法
- 单元：每 Adapter fake 输出稳定
- migration 通过

## DoD
- [ ] 三表 + 4 Adapter；fake 全跑通

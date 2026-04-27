# FP-23 · 实现 LLMAdapter Mock

## 原文引用

- `planning/rules.md`：“本期 dev 不集成任何真实 AI 调用。”
- `planning/rules.md`：“所有 AI 接口仅定义 TypeScript interface + mock 实现。”

## 需求落实

- 页面：无。
- 组件：LLMAdapter interface、MockLLMAdapter、fixture loader。
- API：供内容工厂、红线 Layer2、翻译占位调用。
- 数据表：由调用模块记录 workflow/node/security 结果。
- 状态逻辑：输入固定 fixture，输出稳定 JSON，不访问真实模型。

## 技术假设

- mock fixture 存放在运行工程内测试/seed 目录，不引用规划原文。
- 所有调用可设置 trace_id 便于观测。

## 不明确 / 风险

- 标注：真实 LLM 暂不支持。
- 处理：所有 AI 功能验收只检查契约和 mock 输出。

## 最终验收清单

- [ ] 禁止真实 LLM 网络请求。
- [ ] Mock 输出可复现。
- [ ] 缺 AI key 不影响测试。

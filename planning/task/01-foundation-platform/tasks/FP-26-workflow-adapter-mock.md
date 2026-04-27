# FP-26 · 实现 WorkflowAdapter Mock

## 原文引用

- `planning/rules.md`：“本期 AI 不做真功能，只落接口契约 + mock adapter。”
- `planning/prds/14-content-factory/01-functional-requirements.md`：“状态持久化（PG）+ 可重跑节点。”

## 需求落实

- 页面：后台内容工厂页后续调用。
- 组件：WorkflowAdapter interface、MockWorkflowRunner、node state logger。
- API：供 CF 模块触发 mock workflow。
- 数据表：`factory_workflows`、`factory_node_runs` 由 CF 模块实现。
- 状态逻辑：mock workflow 按节点推进、可失败、可重试，不接 LangGraph 真实执行。

## 技术假设

- 本期只模拟工作流状态和输出。
- 真实 LangGraph 集成是后续版本任务。

## 不明确 / 风险

- 风险：后台演示误认为真实生成内容。
- 处理：UI 标注 mock/v1.5 占位，写入审计与日志。

## 最终验收清单

- [ ] Mock workflow 可创建、运行、失败、重试。
- [ ] 无 AI/workflow key 不影响运行。
- [ ] 节点状态能被后台查询。

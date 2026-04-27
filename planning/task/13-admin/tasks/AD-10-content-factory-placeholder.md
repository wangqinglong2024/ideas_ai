# AD-10 · 实现内容工厂占位与手动导入入口

## PRD 原文引用

- `AD-FR-007`：“v1：页面为‘v1.5 即将上线’占位，仅提供手动导入工具入口（CSV/YAML）。”
- `planning/rules.md`：“本期 dev 不集成任何真实 AI 调用。”

## 需求落实

- 页面：`/admin/content/factory` 或 `/admin/factory`。
- 组件：FactoryComingSoonPanel、ManualImportEntry。
- API：手动导入走各模块 seed/import API。
- 数据表：content_review_workflow、模块内容表。
- 状态逻辑：不触发真实 AI；导入结果进入审校或 draft。

## 不明确 / 风险

- 风险：UX 展示 v1.5 模型选择等未来能力。
- 处理：v1 只保留占位和手动导入入口。

## 技术假设

- CSV/YAML 可先转统一 JSON Schema 再导入。

## 最终验收清单

- [ ] 页面可访问且说明 v1.5 占位。
- [ ] 可进入手动导入。
- [ ] 不出现真实模型调用配置。
- [ ] 导入失败有错误报告。
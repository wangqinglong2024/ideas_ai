# DC-22 · 实现内容边界与红线校验

## PRD 原文引用

- `planning/prds/02-discover-china/01-functional-requirements.md`：“严禁政治 / 宗教 / 民族；严禁泰国王室相关；严禁敏感历史。”
- `content/china/00-index.md`：每个类目有对应详细文档。
- 12 个 `content/china/*.md` 均包含类目定位、内容范围、内容边界或 MVP 内容清单。

## 需求落实

- 页面：后台 DC 文章编辑器、审校工作台。
- 组件：ContentBoundaryPanel、RedlineCheckResult。
- API：`POST /admin/api/content/discover/articles/:id/redline-check`。
- 数据表：`content_review_workflow`、`admin_audit_logs`、可选 `content_policy_rules`。
- 状态逻辑：发布前必须通过类目边界校验和红线校验；失败只能保存草稿/打回。

## 不明确 / 风险

- 风险：红线规则既有通用项也有类目细则。
- 处理：通用红线全局强制，类目边界按 category code 加载。

## 技术假设

- 本期 AI 检测走 mock/fake，人工审校是最终发布门槛。

## 最终验收清单

- [ ] 每个类目的编辑器显示对应内容边界。
- [ ] 发布前必须有红线校验结果。
- [ ] 不合规内容无法发布。
- [ ] 校验结果进入审计或审校记录。
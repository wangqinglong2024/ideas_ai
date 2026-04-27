# AD-11 · 实现审校工作台

## PRD 原文引用

- `AD-FR-008`：“工作流：to_review / in_review / approved / rejected / requested_changes。”
- `AD-FR-008`：“字段对比：原文 / AI 译 / 人工编辑。”
- `AD-FR-008`：“母语审校：评分 + 修改 + 备注；历史版本对比。”

## 需求落实

- 页面：`/admin/content/review`。
- 组件：ReviewQueue、ReviewDiffPanel、ReviewDecisionBar。
- API：`GET /admin/api/review/queue`、approve/reject/edits。
- 数据表：`content_review_workflow`、content_versions、admin_audit_logs。
- 状态逻辑：reviewer 只能审校不能改源；editor/admin 可提交修改。

## 不明确 / 风险

- 风险：AI 译字段在 v1 可能来自导入而非真实 AI。
- 处理：字段名保留，来源可标 manual/import/mock。

## 技术假设

- 审校任务可关联 article/lesson/question/novel_chapter 等资源。

## 最终验收清单

- [ ] 队列按语言/status 过滤。
- [ ] 状态流转正确。
- [ ] reviewer 改源返回 403。
- [ ] 审校决定写审计。
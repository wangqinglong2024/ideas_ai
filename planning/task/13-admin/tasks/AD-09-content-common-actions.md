# AD-09 · 实现内容通用操作

## PRD 原文引用

- `AD-FR-006`：“通用功能：批量发布 / 撤回 / 复制 / 版本历史 / 预览。”
- `planning/ux/11-screens-admin.md`：“所有编辑页支持自动保存 + 历史版本。”

## 需求落实

- 页面：所有内容后台编辑页。
- 组件：BulkActionToolbar、VersionHistoryDrawer、PreviewPane。
- API：`POST /admin/api/content/:module/:id/publish` 等通用 action。
- 数据表：content tables、content_versions、admin_audit_logs。
- 状态逻辑：发布/撤回/复制均写审计；预览不改变发布状态。

## 不明确 / 风险

- 风险：各模块字段差异大。
- 处理：通用 action 抽象状态流，字段编辑留给 14-17。

## 技术假设

- 版本历史可用 JSONB 快照。

## 最终验收清单

- [ ] 批量发布/撤回可按模块执行。
- [ ] 复制生成 draft。
- [ ] 版本历史可查看差异。
- [ ] 预览不会泄漏未授权前台正文。
# UX-19 · 实现后台列表与编辑器通用行为

## 原文引用

- `planning/ux/11-screens-admin.md` 文章编辑器要求“保存草稿 / 提交审校 / 发布 / 删除 / 复制 / 历史版本”。
- `planning/ux/11-screens-admin.md`：“自动保存每 30s。”
- `planning/ux/11-screens-admin.md` 列表展示筛选、搜索、批量操作、新建、分页。

## 需求落实

- 页面：后台内容、用户、订单、币、分销、客服、审计列表；内容编辑器。
- 组件：FilterBar、BulkActionBar、DataTable、Pagination、AutosaveEditor、VersionHistory。
- API：列表/详情/保存/发布/撤回/删除/复制 API 由各模块接入。
- 数据表：各模块内容表、version/audit 表。
- 状态逻辑：编辑器 30s 自动保存；危险操作二次确认；批量操作显示进度。

## 技术假设

- TanStack Table 用于表格。
- 大批量导出异步处理。

## 不明确 / 风险

- 风险：所有模块重复实现列表行为。
- 处理：抽成 admin-ui shared components。

## 最终验收清单

- [ ] 列表支持筛选、搜索、批量、分页。
- [ ] 编辑器自动保存每 30s。
- [ ] 发布/删除/撤回写审计。
# UX-19 · 实现后台列表与编辑器通用行为

## 原文引用

- `planning/ux/11-screens-admin.md` 文章编辑器要求“保存草稿 / 提交审校 / 发布 / 删除 / 复制 / 历史版本”。
- `planning/ux/11-screens-admin.md`：“自动保存每 30s。”
- `planning/ux/11-screens-admin.md` 列表展示筛选、搜索、批量操作、新建、分页。

## 需求落实

- 页面：后台内容、用户、订单、币、分销、客服、审计列表；内容编辑器。
- 组件：FilterBar、BulkActionBar、DataTable、Pagination、AutosaveEditor、VersionHistory。
- API：列表/详情/保存/发布/撤回/删除/复制 API 由各模块接入。
- 数据表：各模块内容表、version/audit 表。
- 状态逻辑：编辑器 30s 自动保存；危险操作二次确认；批量操作显示进度。

## 技术假设

- TanStack Table 用于表格。
- 大批量导出异步处理。

## 不明确 / 风险

- 风险：所有模块重复实现列表行为。
- 处理：抽成 admin-ui shared components。

## 最终验收清单

- [ ] 列表支持筛选、搜索、批量、分页。
- [ ] 编辑器自动保存每 30s。
- [ ] 发布/删除/撤回写审计。

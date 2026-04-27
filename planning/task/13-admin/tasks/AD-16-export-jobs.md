# AD-16 · 实现后台导出

## PRD 原文引用

- `AD-FR-013`：“用户列表 / 订单 / 收益 → CSV / Excel。”
- `AD-FR-013`：“大批量异步任务。”

## 需求落实

- 页面：用户、订单、收益报表页的导出入口。
- 组件：ExportButton、ExportJobStatusToast。
- API：`POST /admin/api/exports`、`GET /admin/api/exports/:id`。
- 数据表：export_jobs、admin_audit_logs；文件入 Supabase Storage uploads/backups 桶。
- 状态逻辑：小批量同步下载，大批量入队异步；导出链接有过期时间。

## 不明确 / 风险

- 风险：Excel 生成库选择未定。
- 处理：CSV 必须实现，Excel 可用轻量库或延后但任务保留。

## 技术假设

- Worker/BullMQ 处理大批量导出。

## 最终验收清单

- [ ] 用户/订单/收益可导出 CSV。
- [ ] 大批量导出异步。
- [ ] 导出操作写审计。
- [ ] 导出文件过期后不可访问。
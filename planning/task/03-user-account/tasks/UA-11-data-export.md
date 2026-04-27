# UA-11 · 用户数据导出

## PRD 原文引用

- `UA-FR-010`：“一键导出 JSON / CSV。”
- `UA-FR-010`：“包含：profile / progress / wrong_set / favorites / notes / orders / coin_ledger。”
- `UA-FR-010`：“邮件链接（24h 有效）。”
- `UA-FR-010`：“限频：每月 1 次。”

## 需求落实

- 页面：`/profile/settings/privacy`。
- 组件：DataExportPanel、ExportRequestButton、ExportStatusList。
- API：`POST /api/me/data-exports`、`GET /api/me/data-exports/:id`。
- 数据表：`user_data_exports`，读取 profile/progress/wrong_set/favorites/notes/orders/coin_ledger。
- 状态逻辑：pending → completed/failed；链接 24h 过期；每用户每月 1 次。

## 技术假设

- 导出任务由 worker 异步执行。
- 文件存 Supabase Storage 私有桶，使用签名 URL。

## 不明确 / 风险

- 风险：部分模块表尚未实现时导出缺字段。
- 处理：导出 schema 支持空数组并记录 module_missing warning，不删字段。

## 最终验收清单

- [ ] 能申请导出并生成 JSON/CSV。
- [ ] 24h 后链接失效。
- [ ] 一个月内重复申请被拒。

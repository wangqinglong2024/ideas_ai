# ADC-08 · 实现 DC Seed / JSON 导入

## PRD 原文引用

- `planning/rules.md`：“发现中国 (DC) | 12 类目 × 每类 ≥ 3 篇 = ≥ 36 篇 articles。”
- `planning/rules.md`：“所有内容模块的种子 JSON 必须符合统一字段约束。”
- `AD-FR-007`：“v1 ... 仅提供手动导入工具入口（CSV/YAML）。”

## 需求落实

- 页面：`/admin/content/articles/import`。
- 组件：ContentImportWizard、ImportValidationReport。
- API：`POST /admin/api/content/discover/import`。
- 数据表：DC 内容表、content_review_workflow、admin_audit_logs。
- 状态逻辑：导入默认 draft/to_review；seed CLI 可直接写 published fixture。

## 不明确 / 风险

- 风险：CSV/YAML 与统一 JSON Schema 冲突。
- 处理：后台先转换成统一 JSON Schema，再共用 upsert。

## 技术假设

- `seed://` 资源上传逻辑与 CLI 共用。

## 最终验收清单

- [ ] 导入前显示 schema 校验结果。
- [ ] 错误行可下载。
- [ ] 成功导入生成 draft/review 记录。
- [ ] 重复导入按 slug upsert。
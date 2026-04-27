# ACR-08 · 课程 seed/导入与审校发布

## PRD 原文引用

- `planning/rules.md` §11.3：JSON Schema 与 `seed://` 协议。
- `AD-FR-008`：审校工作台流转。
- `AD-FR-006`：“通用功能：批量发布 / 撤回 / 复制 / 版本历史 / 预览。”

## 需求落实

- 页面：
  - `/admin/content/courses/import` 导入工具（v1 手动文件上传 / 粘贴 JSON；批量 CSV 入库由 DB 直入承担）。
  - `/admin/content/courses/versions/:resource_id` 版本历史。
  - `/admin/content/review` 审校工作台（13-admin 任务）入口。
- 组件：ImportPanelJsonOnly、ImportDryRunResult、VersionDiffViewer、PublishConfirmDialog、PreviewLink。
- API：
  - `POST /admin/api/content/courses/import` Body `{json}` → dry-run + 提交。
  - `POST /admin/api/content/courses/import/dry-run`。
  - `GET /admin/api/content/courses/:resource_type/:id/versions`。
  - `POST /admin/api/content/courses/:resource_type/:id/publish`。
  - `POST /admin/api/content/courses/:resource_type/:id/archive`。
  - `POST /admin/api/content/courses/:resource_type/:id/duplicate`。

## 状态逻辑

- 导入复用 CR-27 upsert 逻辑。
- dry-run 输出预计 insert/update/skip 数量。
- 版本：每次 publish 写一份快照到 `content_versions(resource_type, resource_id, snapshot, created_at)`。
- 预览：生成临时 token 链接 `/preview/courses/lessons/:id?token=...`，需后台鉴权才能访问，**不可绕过权限模型**。

## 不明确 / 风险

- 风险：批量导入误覆盖已发布内容。
- 处理：dry-run 强制；publish 二次确认；版本快照可恢复。

## 技术假设

- 不实现 CSV 批量导入（用户决定 DB 直入，参照 ADC 任务调整）。
- 导入工具提供 “下载示例 JSON”按钮。

## 最终验收清单

- [ ] JSON 导入 dry-run 正确显示影响。
- [ ] 实际导入 upsert 幂等。
- [ ] publish 写版本快照，可回滚。
- [ ] 预览链接需要 admin token 才能访问。
- [ ] 不存在 CSV 批量导入入口。

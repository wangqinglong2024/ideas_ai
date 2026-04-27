# AD-01 · 建立后台基础数据模型

## PRD 原文引用

- `planning/prds/12-admin/02-data-model-api.md` 定义 `admin_users`、`admin_audit_logs`、`feature_flags`、`admin_announcements`、`content_review_workflow`。

## 需求落实

- 页面：无。
- 组件：无。
- API：所有 `/admin/api/*` 依赖。
- 数据表：上述五张表。
- 状态逻辑：admin user status active/locked/disabled；review workflow status to_review/in_review/approved/rejected/requested_changes。

## 不明确 / 风险

- 风险：后台管理员是否复用 Supabase auth.users。
- 处理：认证复用 Supabase，业务权限落 `admin_users`。

## 技术假设

- `admin_users.email` 与 auth 用户 email 对齐。

## 最终验收清单

- [ ] 五张后台基础表迁移成功。
- [ ] 索引创建成功。
- [ ] admin 种子用户可登录后台。
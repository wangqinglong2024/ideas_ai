# UA-01 · 用户账号数据模型与 RLS

## PRD 原文引用

- `planning/prds/06-user-account/02-data-model-api.md`：“Supabase auth.users 已存在；本模块定义 profiles。”
- 同文件 DDL 定义 `users`、`user_preferences`、`user_devices`、`user_sessions`、`user_email_otp`、`user_data_exports`。
- 同文件：“ALTER TABLE users ENABLE ROW LEVEL SECURITY; CREATE POLICY rlsp_self...”

## 需求落实

- 页面：无。
- 组件：无。
- API：所有 `/api/auth/*` 与 `/api/me/*` 依赖这些表。
- 数据表：`users`、`user_preferences`、`user_devices`、`user_sessions`、`user_email_otp`、`user_data_exports`。
- 状态逻辑：用户状态 `active/suspended/deleted_pending/deleted`；session 可 revoked；OTP 可 consumed。

## 技术假设

- `users.id = auth.users.id`。
- 业务 schema 在 Supabase Postgres `zhiyu` 下。

## 不明确 / 风险

- 风险：表名 `users` 与 Supabase Auth 概念混淆。
- 处理：代码层命名可用 `profiles` repository，但数据库按 PRD 保持 `users`。

## 最终验收清单

- [ ] 六张 UA 表迁移成功。
- [ ] RLS 只允许用户读写自己的偏好/设备/session。
- [ ] admin 访问由 AD 权限路径处理，不破坏 RLS。

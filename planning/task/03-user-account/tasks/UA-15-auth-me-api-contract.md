# UA-15 · Auth 与 Me API 契约

## PRD 原文引用

- `planning/prds/06-user-account/02-data-model-api.md` API 章节列出 `POST /api/auth/register`、`POST /api/auth/login`、`POST /api/auth/oauth/google`、`POST /api/auth/refresh`、`POST /api/auth/logout`、`POST /api/auth/logout-all`。
- 同章节列出 `GET /api/me`、`PATCH /api/me`、`PATCH /api/me/preferences`、`GET /api/me/sessions`、`DELETE /api/me/sessions/:id`、`POST /api/me/avatar`。

## 需求落实

- 页面：所有账号页面依赖这些 API。
- 组件：SDK auth client、me client。
- API：完整实现 PRD 所列端点，不删减。
- 数据表：UA-01 所有表。
- 状态逻辑：refresh rotation、logout revoke、me 返回 profile+preferences+verification flags。

## 技术假设

- API 响应统一 `{ data, meta, error }`。
- 错误返回 code，由 i18n 客户端翻译。

## 不明确 / 风险

- 风险：Supabase Auth 自带接口与自定义 API 重叠。
- 处理：前端只调用知语 API，由后端封装 Supabase。

## 最终验收清单

- [ ] PRD 列出的 auth/me API 全部存在。
- [ ] SDK 有类型定义。
- [ ] 401/403/429 错误 code 稳定。

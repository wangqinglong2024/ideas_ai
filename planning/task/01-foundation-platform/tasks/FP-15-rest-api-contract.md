# FP-15 · 建立 REST API 契约

## 原文引用

- `planning/spec/04-backend.md`：“公开 API 仍 REST。”
- `planning/spec/04-backend.md`：“响应格式 `{ data, meta, error }`。”

## 需求落实

- 页面：无。
- 组件：API response helper、pagination helper、error code registry。
- API：app 使用 `/api/v1/*`；admin 使用 `/admin/api/*`。
- 数据表：无。
- 状态逻辑：成功响应 `error=null`，失败响应 `data=null` 并带稳定错误 code。

## 技术假设

- OpenAPI 文档可由路由 schema 生成或手写维护。
- API 错误 message 由 i18n 客户端翻译，服务端返回 code 和参数。

## 不明确 / 风险

- 风险：不同模块自定义响应格式导致 SDK 混乱。
- 处理：SDK 单元测试固定响应结构。

## 最终验收清单

- [ ] `/api/v1/*` 和 `/admin/api/*` 前缀清晰分离。
- [ ] 所有 API 返回 `{ data, meta, error }`。
- [ ] 分页字段统一。

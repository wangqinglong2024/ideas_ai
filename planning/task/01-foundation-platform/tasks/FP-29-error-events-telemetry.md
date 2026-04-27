# FP-29 · 建立前端错误上报与 error_events

## 原文引用

- `planning/spec/10-observability.md`：“前端全局拦截 → POST `/api/v1/_telemetry/error`。”
- `planning/spec/10-observability.md`：“后端写入 `error_events` 表。”
- `planning/rules.md`：“禁用 Sentry SaaS；前端用全局错误上报到自建接口。”

## 需求落实

- 页面：全局 ErrorBoundary 和错误反馈页。
- 组件：frontend telemetry client、ErrorBoundary、backend telemetry route。
- API：`POST /api/v1/_telemetry/error`。
- 数据表：`error_events`。
- 状态逻辑：前端 runtime error/unhandled rejection 上报；后端脱敏后入库。

## 技术假设

- error_events 表由平台迁移创建。
- admin 后续可查询错误事件。

## 不明确 / 风险

- 风险：错误 payload 携带用户隐私。
- 处理：客户端和服务端双重裁剪/脱敏。

## 最终验收清单

- [ ] 前端 ErrorBoundary 捕获错误。
- [ ] API 可写入 error_events。
- [ ] 不引入 Sentry SaaS SDK。

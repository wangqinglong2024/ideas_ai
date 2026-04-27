# FP-30 · 建立产品行为事件 tracking

## 原文引用

- `planning/spec/10-observability.md`：“表：events { id, ts, user_id?, anon_id, type, props jsonb }。”
- `planning/prds/01-overall/02-goals-vision.md`：“可观测：每个功能都有指标 + Dashboard。”

## 需求落实

- 页面：无特定页面；全局 track SDK 被各模块调用。
- 组件：frontend track SDK、backend event endpoint、event repository。
- API：`POST /api/v1/_telemetry/event` 或批量事件接口。
- 数据表：`events`。
- 状态逻辑：匿名和登录用户均可记录事件，事件 props 必须 JSON schema 校验。

## 技术假设

- 不接 PostHog/Plausible SaaS。
- Dashboard 后续从自建 events 聚合。

## 不明确 / 风险

- 风险：事件名失控导致分析不可用。
- 处理：维护 event type registry。

## 最终验收清单

- [ ] 前端可发送匿名和登录事件。
- [ ] 后端写入 events 表。
- [ ] 事件 props 经过大小限制和脱敏。

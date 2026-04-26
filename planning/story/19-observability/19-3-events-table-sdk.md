# ZY-19-03 · 行为埋点 events + 数据 SDK

> Epic：E19 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] FE `useEvent(name, props)` hook + auto pageview
- [ ] BE `analytics.track(userId, name, props)` 服务端事件
- [ ] POST `/api/v1/_telemetry/event` 批量（5s flush 或 20 条）
- [ ] `zhiyu.events` 按月分区
- [ ] **禁止** import posthog-js
- [ ] 事件 schema yaml 在 `_bmad/`（可选）

## 测试方法
- 集成：批量 POST → 表行数
- 单元：批量 flush 时机

## DoD
- [ ] 全自建；月分区高效

# ZY-19-02 · 自建错误追踪表 error_events

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu.error_events(id, ts, env='dev', release, user_id, url, message, stack, context jsonb, fingerprint)`
- [ ] FE 全局 errorBoundary + window.onerror → POST `/api/v1/_telemetry/error`
- [ ] BE express error middleware → 写表
- [ ] dedup 指纹：`hash(message + stack 前 3 行)`，相同 fingerprint 累加 count
- [ ] **禁止** import @sentry/*

## 测试方法
- 集成：FE throw + BE throw 都落表
- 重复 → fingerprint 一致

## DoD
- [ ] dedup 准确

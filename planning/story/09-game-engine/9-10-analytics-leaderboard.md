# ZY-09-10 · Analytics（events 表） + 排行榜

> Epic：E09 · 估算：M · 阶段：V1 · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 埋点 hook `useGameEvent(name, props)` → 批量 POST `/api/v1/_telemetry/event`
- [ ] BE 落 `zhiyu.events(ts, user_id, name, props jsonb)`，按月分区
- [ ] `zhiyu.game_runs(user_id, slug, score, duration_ms, ts)` 表
- [ ] GET `/api/v1/games/:slug/leaderboard?range=daily|weekly|all` 聚合
- [ ] **禁用 PostHog**

## 测试方法
- 集成：mock 一局 → events 表 / game_runs 表落行 → 排行榜可见
- 单元：聚合 SQL 正确

## DoD
- [ ] 排行榜准确；events 表索引高效

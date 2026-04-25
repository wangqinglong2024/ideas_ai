# Story 9.10: 游戏埋点上报（错题入 SRS / 局数统计）

Status: ready-for-dev

## Story

作为 **数据 / 学习引擎**，
我希望 **每局游戏结束时上报错题、得分（仅用于本地展示）、用时、词包、游戏 code**，
以便 **错题进入 SRS、统计游戏使用情况；但 MVP 不构建排行榜 / 奖励**。

## Acceptance Criteria

1. 引擎在 Settle 状态调 `engine.reportRound(payload)`，向 host 应用 postMessage。
2. host 应用收到后调 `POST /v1/games/round`，body 含 `{ game_code, word_pack, duration_ms=60000, score, mistakes:[{question_id, kp_id}], time_ms, started_at }`。
3. 后端写表 `game_sessions`（id / user_id / game_code / score / duration_ms / mistakes_count / created_at）。
4. mistakes 数组逐条 upsert 到 `mistakes` 表（与 7-3 共用），source_type='game'。
5. **不**写排行榜表 / **不**计算 coins / **不**触发 xp.gained 事件（与 60s 无奖励规则一致）。
6. 限流：60/min/user。
7. 失败重试 / 离线缓存（host webview 在线后 flush）。
8. 单元 + 集成测试。

## Tasks / Subtasks

- [ ] **引擎事件**（AC: 1）
  - [ ] `engine.reportRound`（postMessage）
- [ ] **Host 桥接**（AC: 2,7）
  - [ ] `apps/games-host/src/bridge.ts`
- [ ] **API**（AC: 2,3,4,5,6）
  - [ ] `routes/games/round.ts`
- [ ] **Schema**（AC: 3）
  - [ ] `game_sessions` 表（精简版）

## Dev Notes

### 关键约束
- **MVP 显式禁止**写 `game_leaderboards`、HMAC 签名、coin 发放；这些移到 99-post-mvp-backlog。
- 重命名旧 epic 节标题中的「leaderboard」字样为「埋点」（仅在本 story 上下文中）。
- 离线缓存使用 IndexedDB（idb-keyval），上线后 flush。

### 关联后续 stories
- 7-3 mistakes 共用
- 12-* 经济 NOT used here
- E14 admin 数据看板可消费 game_sessions

### Project Structure Notes
- `apps/games-host/src/bridge.ts`
- `apps/api/src/routes/games/round.ts`
- `packages/db/schema/games.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-10
- `planning/prds/04-games/02-data-model-api.md`（MVP 收敛说明）

### 测试标准
- 单元：mistakes upsert 幂等
- 集成：离线 → 在线 flush
- 安全：禁止上报 coins / xp 字段

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

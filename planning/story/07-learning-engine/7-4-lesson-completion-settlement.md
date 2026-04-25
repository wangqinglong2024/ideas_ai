# Story 7.4: 节完成结算（XP / 知语币 / 解锁下一节）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **完成一节课后系统自动结算 XP、知语币与正确率，并解锁下一节**，
以便 **持续推进学习并获得反馈与奖励**。

## Acceptance Criteria

1. BullMQ 消费 `lesson.completed` 事件，幂等处理（同 user_id+lesson_id 仅结算 1 次）。
2. 计算 XP：`xp = base(10) + correctness_bonus(round(score_percent * 0.5)) + speed_bonus(time<expected ? 5 : 0)`。
3. 计算知语币：`coins = base(5) + 3⭐? +5 : 0`（三星 = score_percent ≥ 95）。
4. 更新 `lesson_progress`：status / score_percent / xp / coins / time_seconds / completed_at。
5. 调用 E12 经济模块 `EC.grantCoins(user_id, coins, source: 'lesson:'+lesson_id)`，幂等键 = lesson_id。
6. 解锁下一节：标记同 stage 内 `lesson_id+1` 的 `unlocked = true`（lesson_unlocks 表，若不存在则创建）。
7. 推荐复习 / 游戏：返回结算结果中包含 `recommended_review_count`（来自 7-5 mistakes 推荐）和 `recommended_game_codes`（基于 lesson 知识点 → 游戏映射规则）。
8. 触发 `xp.gained` 事件，由 7-8 / 7-9 消费。
9. 失败重试：BullMQ 自动重试 3 次，最终失败入死信队列。

## Tasks / Subtasks

- [ ] **Worker**（AC: 1,9）
  - [ ] `apps/worker/src/jobs/lesson-completion.ts`
- [ ] **Settlement Service**（AC: 2,3,4,5,6）
  - [ ] `services/lesson-settlement.service.ts`
  - [ ] xp / coins / unlock 计算
- [ ] **推荐**（AC: 7）
  - [ ] 调 7-5 SRS service
  - [ ] 查 game_recommendation map
- [ ] **事件**（AC: 8）

## Dev Notes

### 关键约束
- 结算必须**幂等**：lesson_progress.completed_at 已存在 → 跳过。
- 经济模块解耦：游戏奖励禁止调用本结算（E10 已约束不发奖励）。
- 推荐游戏使用静态映射表：lesson.tags → games.tags。

### 关联后续 stories
- 7-8 消费 xp.gained 更新 user level
- 7-9 streak 校准
- 8-9 节完成结算页消费此 API 返回值
- 12-* 经济模块 grantCoins

### Project Structure Notes
- `apps/worker/src/jobs/lesson-completion.ts`
- `apps/api/src/services/lesson-settlement.service.ts`
- `packages/db/schema/learning.ts` (lesson_unlocks 表新增)

### References
- `planning/epics/07-learning-engine.md` ZY-07-04
- `planning/story/07-learning-engine/7-3-step-progression-api.md`

### 测试标准
- 单元：XP / coins 公式
- 集成：幂等 / unlock / event chain
- 性能：单结算 P95 < 300ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

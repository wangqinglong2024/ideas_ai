# Story 7.5: SRS 复习引擎（SM-2 简化版）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **每日「温故知新」推荐我应当复习的错题与生词**，
以便 **基于遗忘曲线巩固记忆，避免知识点流失**。

## Acceptance Criteria

1. 实现 SM-2 简化算法：`interval` 初始 1 天 → 答对：`interval *= ease_factor (默认 2.5)`、答错：`interval = 1 day, ease_factor -= 0.2 (下限 1.3)`。
2. `mistakes.next_review_at` 与 `vocabulary_book.next_review_at`（来自 7-6）由本服务统一调度。
3. `GET /v1/me/reviews/today` 返回今日应复习列表（按 next_review_at 升序，limit 30），包含混合源（mistakes + vocabulary_book）。
4. `POST /v1/me/reviews/:id/answer` 接受 `{ is_correct, time_ms }`，更新 ease_factor / interval / next_review_at；连续 3 次答对 → `mastered = true` 且不再调度。
5. 每日 0:00（用户时区）由 cron 重置「今日待复习计数」，写入 `user_daily_stats.review_due_count`。
6. 推送通知（接 1-12）：早 9:00（用户时区）若 review_due_count > 0 推送一次。
7. 限流 60/min/user。
8. 提供 admin 调试接口 `GET /v1/admin/reviews/inspect/:user_id`（仅 dev profile）。

## Tasks / Subtasks

- [ ] **算法实现**（AC: 1,4）
  - [ ] `services/srs/sm2.ts`
  - [ ] 单元测试覆盖正负边界
- [ ] **API**（AC: 3,4,7）
  - [ ] `routes/me/reviews.ts`
- [ ] **Cron**（AC: 5,6）
  - [ ] BullMQ 定时任务：每小时检查所有时区 0:00
  - [ ] 推送队列入队
- [ ] **联动错题 / 词本**（AC: 2）

## Dev Notes

### 关键约束
- ease_factor 必须 clamp 在 [1.3, 2.5]，防止退化。
- 时区处理统一通过 `users.timezone` 字段；缺省 Asia/Shanghai。
- mastered 状态可通过运营后台手动重置（E14）。

### 关联后续 stories
- 7-6 词本同步使用 SRS
- 7-7 错题本展示 next_review_at
- 1-12 推送通道

### Project Structure Notes
- `apps/api/src/services/srs/sm2.ts`
- `apps/api/src/routes/me/reviews.ts`
- `apps/worker/src/jobs/srs-cron.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-05
- 算法参考：SM-2 https://en.wikipedia.org/wiki/SuperMemo

### 测试标准
- 单元：30 种 (is_correct, ease_factor, interval) 组合
- 集成：API + cron 推送链路
- 性能：今日复习查询 P95 < 100ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 7.1: enrollments / progress / mistakes 表 + 索引 + RLS

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立学习引擎核心数据模型（enrollments / lesson_progress / step_progress / mistakes）并附带索引与 RLS 策略**，
以便 **课程报名、节内步骤推进、错题、SRS、XP / streak 全部有可靠的数据底座**。

## Acceptance Criteria

1. Drizzle schema 在 `packages/db/schema/learning.ts` 内创建以下表：
   - `enrollments`：id / user_id / track_slug / stage_no / status(active|paused|finished|dropped) / started_at / last_active_at / completed_at。
   - `lesson_progress`：id / user_id / lesson_id / status(not_started|in_progress|completed) / score_percent / total_xp / total_coins / time_seconds / completed_at。
   - `step_progress`：id / user_id / lesson_id / step_index / payload_hash / answered_at / is_correct / response_jsonb / time_ms / attempt_no。
   - `mistakes`：id / user_id / source_type(course|game|reading) / source_id / question_id / kp_id / wrong_count / mastered / next_review_at / last_seen_at。
2. 索引：`enrollments(user_id, track_slug)`、`lesson_progress(user_id, lesson_id)`、`step_progress(user_id, lesson_id, step_index)`、`mistakes(user_id, mastered, next_review_at)`。
3. 启用 RLS：`enable row level security`，policy `using (user_id = auth.uid())` 应用于 SELECT / INSERT / UPDATE / DELETE。
4. 迁移脚本可正向 / 反向运行；`drizzle-kit generate` 输出干净。
5. 类型导出：`Enrollment`、`LessonProgress`、`StepProgress`、`Mistake` 在 `@zy/db` 索引中可导入。
6. seed：插入 1 个测试用户 + 1 条 active enrollment 用于本地联调（仅 dev profile）。
7. 验证：本地 supabase 迁移成功，psql 查询 `select * from mistakes` 受 RLS 限制。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1,2,5）
  - [ ] `packages/db/schema/learning.ts` 4 张表
  - [ ] 复合索引
  - [ ] 类型导出
- [ ] **RLS Policies**（AC: 3）
  - [ ] sql 文件 `db/policies/learning.sql`
  - [ ] `enable rls` + `for all using (user_id = auth.uid())`
- [ ] **Migration**（AC: 4）
  - [ ] `drizzle-kit generate`
  - [ ] 正向 / 反向 SQL 校验
- [ ] **Seed (dev)**（AC: 6）
  - [ ] `packages/db/seeds/learning-dev.ts`
- [ ] **手工验证**（AC: 7）
  - [ ] supabase reset → migrate → seed → query

## Dev Notes

### 关键约束
- `enrollments` 与 `course_*` 表（E08）通过 `track_slug + stage_no` 软关联，**不**建外键，便于跨模块解耦。
- `mistakes.next_review_at` 是 SRS 调度核心字段，需要二级索引以支撑每日推荐查询（7-5）。
- `step_progress.payload_hash` 用来识别同一步骤多次答题的尝试，必须可对比。
- RLS 需覆盖所有 4 表，**严禁**仅靠应用层校验。

### 关联后续 stories
- 7-2 报名 API 写 `enrollments`
- 7-3 步骤推进 API 写 `step_progress`、`mistakes`
- 7-4 节完成结算更新 `lesson_progress`
- 7-5 SRS 引擎读 / 写 `mistakes`
- 7-7 错题本基于 `mistakes`
- 7-8 XP 累加从 `lesson_progress`

### Project Structure Notes
- `packages/db/schema/learning.ts`
- `packages/db/migrations/*` (generated)
- `db/policies/learning.sql`
- `packages/db/seeds/learning-dev.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-01
- `planning/spec/05-*` § 4.10
- 平台基础：`planning/story/01-platform-foundation/1-10-supabase-init.md`

### 测试标准
- 单元：schema 类型可编译
- 集成：迁移正向 / 反向；RLS 拒绝跨用户读取
- 性能：`mistakes(user_id, mastered=false, next_review_at < now())` 查询走索引（EXPLAIN）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

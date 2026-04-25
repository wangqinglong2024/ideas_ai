# Story 7.2: 课程报名 / 进入 / 退出 API

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **能够报名某条学习轨道（日常 / 电商 / 工厂 / HSK）的某个阶段，并在「我的学习」中查看与退出**，
以便 **进入对应课程、章节、节、步骤的学习闭环**。

## Acceptance Criteria

1. `POST /v1/enrollments` 接受 `{ track_slug, stage_no }`，校验：
   - 同 user_id + track_slug 仅能同时存在 1 条 `status=active`，重复报名同 track 返回已有记录（200，不重复创建）。
   - 同 user_id 整体最多 4 条 active enrollment（4 条轨道并行）。
   - track_slug 必须 ∈ {`daily`,`ecommerce`,`factory`,`hsk`}；stage_no ∈ [1,12]。
2. `GET /v1/me/enrollments` 返回当前用户全部 enrollments（按 last_active_at desc），含 `progress_summary`：completed_lessons / total_lessons / xp / streak_days（streak 由 7-9 提供，缺失时返回 0）。
3. `DELETE /v1/enrollments/:id` 软删（status → `dropped`），仅 owner 可调；不删除 lesson_progress 历史。
4. `PATCH /v1/enrollments/:id` 支持 `status: paused | active`（暂停 / 恢复）。
5. 全部接口要求登录；未登录返回 401。
6. 限流：`POST` 6/min/user，`GET` 60/min/user。
7. 错误返回统一 `{ code, message }` 结构（与 E03 已建立的错误规范一致）。
8. OpenAPI 文档（zod-to-openapi）自动生成。

## Tasks / Subtasks

- [ ] **路由**（AC: 1,2,3,4,5）
  - [ ] `apps/api/src/routes/enrollments.ts`
  - [ ] `routes/me/enrollments.ts`
- [ ] **Service 层**（AC: 1,2）
  - [ ] `services/enrollment.service.ts`：create / list / update / drop
  - [ ] 4 条并行约束
- [ ] **Schema 校验**（AC: 1)
  - [ ] zod schema：track_slug enum / stage_no 范围
- [ ] **限流 + 鉴权**（AC: 5,6）
  - [ ] 复用 `apps/api/src/middleware/auth.ts` 与 rateLimiter
- [ ] **OpenAPI**（AC: 8）

## Dev Notes

### 关键约束
- 「报名」≠ 「付费」，付费墙在 8-10 校验。
- `progress_summary` 需聚合 `lesson_progress`：可能涉及上千行，必须用预聚合视图或 `count(*) filter (...)`，避免 N+1。
- track_slug 为字符串而非外键，以便 E16 内容工厂动态扩轨道。

### 关联后续 stories
- 7-3 step progression 校验 user 是否对应 lesson 所属 track 的 active enrollment
- 7-4 节完成会触发 enrollments.last_active_at 更新
- 8-3 课程列表 API 通过 enrollment 高亮已报轨道

### Project Structure Notes
- `apps/api/src/routes/enrollments.ts`
- `apps/api/src/services/enrollment.service.ts`
- `apps/api/src/schemas/enrollment.schema.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-02
- `planning/story/07-learning-engine/7-1-enrollments-progress-mistakes-tables.md`

### 测试标准
- 单元：service 4 条并行限制 / 重复报名幂等
- 集成：401 / 403 / 200 各路径
- 性能：list 接口 P95 < 100ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

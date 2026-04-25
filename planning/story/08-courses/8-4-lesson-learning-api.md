# Story 8.4: 节学习 API（开始 / 提交进度 / 完成）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **进入一节课时拿到完整步骤序列、答题过程中实时提交、最终能完成结算**，
以便 **顺利走完节学习闭环**。

## Acceptance Criteria

1. `POST /v1/lessons/:id/start`：创建 / 续期 lesson_progress (status=in_progress, started_at)，返回 `{ steps[], resume_step_index }`。
2. `POST /v1/lessons/:id/steps/:n/answer`：复用 7-3 接口（本 story 不重复实现，仅文档化整合）。
3. `POST /v1/lessons/:id/complete`：人工触发完成（兜底用，正常由 7-3 答完最后一步自动完成），幂等。
4. `GET /v1/lessons/:id/progress`：返回当前用户的 step_progress（已答步骤集）。
5. `POST /v1/lessons/:id/abandon`：标记中途放弃（lesson_progress.status=not_started 重置，但不重置 step_progress 历史）。
6. 鉴权：require active enrollment 或 paid 通过；否则 403 / 422。
7. 限流：开始 6/min；progress 60/min。

## Tasks / Subtasks

- [ ] **API**（AC: 1,3,4,5,6,7）
- [ ] **resume 逻辑**（AC: 1）
  - [ ] 找到最后一个 is_correct=true 的 step_index + 1 → resume
- [ ] **幂等结算**（AC: 3）
  - [ ] 同 7-4 settlement 幂等
- [ ] **测试**

## Dev Notes

### 关键约束
- start 接口返回 steps payload 时受付费墙影响（同 8-3）。
- abandon 不删除 step_progress：保留答题尝试记录用于后续分析。

### 关联后续 stories
- 7-3 / 7-4 strong dependency
- 8-7 节学习页消费

### Project Structure Notes
- `apps/api/src/routes/lessons/[id]/start.ts`
- `apps/api/src/routes/lessons/[id]/complete.ts`
- `apps/api/src/routes/lessons/[id]/progress.ts`

### References
- `planning/epics/08-courses.md` ZY-08-04

### 测试标准
- 集成：start → answer × N → complete 完整链路
- 性能：start P95 < 200ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

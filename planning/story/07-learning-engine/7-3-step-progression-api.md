# Story 7.3: 节内步骤推进 + 答案校验 + 错题入库

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **在节学习页提交每一步答案后，系统能立即校验对错、记录用时与错题，并推进到下一步**，
以便 **完整地体验节内 10 种步骤类型的学习闭环**。

## Acceptance Criteria

1. `POST /v1/lessons/:lesson_id/steps/:step_index/answer` 接受 `{ response, time_ms, attempt_no }`，返回 `{ is_correct, expected, explanation, next_step_index | null, lesson_completed }`。
2. 后端按 `step_type` 调用对应校验器（10 种：`sentence`、`word_card`、`choice`、`order`、`match`、`listen`、`read`、`translate`、`type_pinyin`、`dialog`），统一通过 `validators[stepType](payload, response)`。
3. 每次答题写 `step_progress`（包含 `response_jsonb`、`time_ms`、`is_correct`、`attempt_no`）。
4. 答错时插入 `mistakes` 记录（如同一 question_id 已存在则 `wrong_count + 1`、`last_seen_at = now()`、`mastered = false`、`next_review_at = now() + 1 day`）。
5. 校验授权：lesson 所属 track 必须有当前用户 active enrollment（依赖 7-2），否则 403。
6. 付费墙（依赖 8-10）：付费节未购买 → 422 + `code: PAYMENT_REQUIRED`。
7. 限流：30/min/user。
8. 计算 lesson_completed：当 step_index 为最后一步且 `is_correct = true`，触发 7-4 节完成结算（异步事件 `lesson.completed`）。
9. 失败重试支持：`attempt_no` 递增，前端可多次提交同一步骤。

## Tasks / Subtasks

- [ ] **路由 + 校验**（AC: 1,2,5,6,7）
  - [ ] `routes/lessons/[id]/steps/[n]/answer.ts`
  - [ ] zod request schema
- [ ] **Validator 注册表**（AC: 2）
  - [ ] `services/step-validators/index.ts` 10 种校验器
  - [ ] 每种各自单元测试
- [ ] **Persistence**（AC: 3,4）
  - [ ] `step_progress` insert
  - [ ] `mistakes` upsert（带 wrong_count 累加）
- [ ] **事件总线**（AC: 8）
  - [ ] 发 `lesson.completed { user_id, lesson_id }` 至 BullMQ（接 7-4）

## Dev Notes

### 关键约束
- 校验逻辑必须**完全在后端**：response 任何 hash / json 比较禁止前端做。
- `mistakes` 表幂等：同 (user_id, source_type, question_id) 唯一。
- listen / read 校验涉及音频比对，MVP 使用「文本匹配」为主，ASR 占位（与 8-8 一致）。
- explanation 字段从 step.payload.explanation 取，未定义返回空串。

### 关联后续 stories
- 7-4 节完成结算 listen `lesson.completed` 事件
- 7-5 SRS 写 mistakes 后参与下次复习池
- 8-7 / 8-8 节学习页 / 步骤组件消费此 API

### Project Structure Notes
- `apps/api/src/routes/lessons/[id]/steps/[n]/answer.ts`
- `apps/api/src/services/step-validators/*.ts`
- `apps/api/src/events/lesson.events.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-03
- `planning/spec/05-*` § 4.10 / § 6（步骤类型）

### 测试标准
- 单元：10 种 validator 各 ≥ 3 用例（正 / 负 / 边界）
- 集成：错题幂等 / lesson_completed 事件触发
- 性能：P95 < 200ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

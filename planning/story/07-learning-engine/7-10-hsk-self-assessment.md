# Story 7.10: HSK 自评测（self-assessment）

Status: ready-for-dev

## Story

作为 **新用户**，
我希望 **在引导中完成 HSK 自评（5 道题快速判断），系统据此推荐学习起点**，
以便 **跳过太简单 / 太难的内容，直击适合阶段**。

## Acceptance Criteria

1. 题库：`hsk_self_assessment_items` 含 30 题，各覆盖 HSK1-6（每级 5 题）。
2. `POST /v1/onboarding/hsk-assessment/start` 返回 5 题（自适应：从 HSK3 起，答对升一档，答错降一档）。
3. `POST /v1/onboarding/hsk-assessment/answer` 提交单题，返回下一题 / 终判结果 `{ recommended_hsk_level, suggested_track }`。
4. 推荐映射：HSK1-2 → daily 阶段 1；HSK3-4 → daily 阶段 6；HSK5-6 → ecommerce / factory 阶段 1（按问卷偏好）。
5. 结果写入 `users.profile.hsk_self_level`，仅评测 1 次（除非用户显式重测）。
6. 限流：每用户每天最多 3 次。

## Tasks / Subtasks

- [ ] **Schema + seed**（AC: 1）
  - [ ] 30 题 seed 文件
- [ ] **API**（AC: 2,3,5,6）
- [ ] **自适应算法**（AC: 2）
  - [ ] `services/hsk-adaptive.ts`
- [ ] **推荐引擎**（AC: 4）

## Dev Notes

### 关键约束
- 5 题为 MVP 上限，避免引导过长流失。
- 自适应起点 HSK3 是经验值，可后续运营后台调整。

### 关联后续 stories
- 7-11 自动评测 stub
- 5-* 引导流（onboarding）调用

### Project Structure Notes
- `apps/api/src/routes/onboarding/hsk-assessment.ts`
- `apps/api/src/services/hsk-adaptive.ts`
- `packages/db/seeds/hsk-self-assessment.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-10

### 测试标准
- 单元：自适应升降档
- 集成：5 题闭环 / 推荐输出

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

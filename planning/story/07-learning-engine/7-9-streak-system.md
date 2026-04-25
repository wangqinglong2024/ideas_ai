# Story 7.9: 连续学习天数 streak 系统

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **每天完成至少 1 节课会维持「连续学习」天数，断签可消耗补签卡补救**，
以便 **保持学习节奏并获得连续奖励**。

## Acceptance Criteria

1. 表 `user_streak`：user_id (PK) / current_days / longest_days / last_active_date / freeze_count。
2. 每完成 1 节（消费 7-4 lesson.completed 事件）→ 当日首次 → current_days +1，更新 last_active_date。
3. 跨天检测（cron 每小时按时区扫）：`last_active_date != today - 1` → 自动消耗 freeze_count（如有），否则 current_days = 0。
4. 补签卡：用户每月赠送 2 张 freeze；可在仪表盘消耗。
5. `GET /v1/me/streak` 返回完整状态。
6. milestone 推送（7 / 30 / 100 / 365 天）：`streak.milestone` 事件 → 推送 + +知语币奖励（10 / 50 / 200 / 500）。
7. RLS。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1）
- [ ] **Service**（AC: 2,3,4,6）
  - [ ] `services/streak.service.ts`
- [ ] **Cron**（AC: 3）
- [ ] **API**（AC: 5）

## Dev Notes

### 关键约束
- last_active_date 严格按用户时区（user.timezone）存储为 date。
- freeze 消耗顺序：先用 freeze，再断签清零，避免提前清零。
- milestone 奖励通过 E12 经济模块发放，不在本 service 直发。

### 关联后续 stories
- 7-12 仪表盘 streak 卡片
- 1-12 推送
- E12 经济发币

### Project Structure Notes
- `apps/api/src/services/streak.service.ts`
- `apps/worker/src/jobs/streak-cron.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-09

### 测试标准
- 单元：跨天 / freeze 消耗
- 集成：milestone 链路

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

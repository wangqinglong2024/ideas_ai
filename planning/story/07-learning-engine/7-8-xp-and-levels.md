# Story 7.8: XP 与等级系统

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **学习获得 XP 累积升级，并在仪表盘看到等级进度条**，
以便 **持续获得成长反馈**。

## Acceptance Criteria

1. 表 `user_xp`：user_id (PK) / total_xp / current_level / xp_to_next。
2. 等级公式：`xp_required(level) = 100 * level^1.5`，1 → 60 级。
3. `xp.gained` 事件消费 → 累加 total_xp，跨级时多次升级。
4. 升级触发 `level.up` 事件，由 1-12 推送 + 仪表盘横幅展示。
5. `GET /v1/me/xp` 返回 `{ total_xp, current_level, xp_to_next, percent_to_next }`。
6. 等级从 1 起步；达到 60 级后停止升级，仅累加 total_xp。
7. RLS + 限流。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1）
- [ ] **Service**（AC: 2,3,4,6）
  - [ ] `services/xp.service.ts`
- [ ] **API**（AC: 5,7）
- [ ] **事件订阅**

## Dev Notes

### 关键约束
- 公式输出需四舍五入为整数；公式可后续运营后台调整。
- 升级事件去重：同次 lesson 完成产生多级提升只算 1 次推送。

### 关联后续 stories
- 7-9 streak 联动（保持登录）
- 7-12 仪表盘卡片
- 1-12 推送

### Project Structure Notes
- `apps/api/src/services/xp.service.ts`
- `packages/db/schema/learning.ts` (user_xp)

### References
- `planning/epics/07-learning-engine.md` ZY-07-08

### 测试标准
- 单元：公式 / 跨级
- 集成：xp.gained → level.up 链路

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

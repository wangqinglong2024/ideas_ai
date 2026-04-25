# Story 12.8: 签到 7 天

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **每日签到领币、连续 7 天有阶梯奖励、漏签可用知语币补签**，
以便 **培养每日打开习惯**。

## Acceptance Criteria

1. `checkin_records(user_id, date_utc, streak_day, awarded int, makeup bool, created_at)`，主键 `(user_id, date_utc)`。
2. `POST /v1/checkin/today`：当天首次签到，按 streak（1-7 循环）发币，调用 12-2 awardCoins（source=checkin）。
3. 签到中断（前一天未签且未补签）→ streak 重置为 1。
4. 阶梯奖励默认：日 1 / 2 / 3 / 5 / 5 / 8 / 15（运营可调，存 `coins_earning_rules` 或独立 seed）。
5. `POST /v1/checkin/makeup`：补签前 N 天，消耗 `cost_coins` × 距今天数（默认 5 / 天，可调）；调用 12-3 spend；写 `makeup=true`。
6. `GET /v1/checkin/state` 返回近 7 天日历 + 当前 streak。
7. 反作弊（12-10）：单日双签拒绝；改时区刷币治理。
8. UI：签到按钮 + 7 日日历 + 补签弹窗 + i18n。

## Tasks / Subtasks

- [ ] schema（AC: 1）
- [ ] 今日签到 + streak（AC: 2,3,4）
- [ ] 补签（AC: 5）
- [ ] state API（AC: 6）
- [ ] UI（AC: 8）
- [ ] 反作弊钩子（AC: 7）
- [ ] 测试

## Dev Notes

### 关键约束
- date_utc 初版 UTC，TODO 时区。
- 阶梯奖励放 `coins_earning_rules` 中 `source=checkin, action_key=day_<n>` 7 行 seed。

### Project Structure Notes
- `packages/db/schema/checkin.ts`
- `apps/api/src/routes/checkin.ts`
- `apps/web/src/components/checkin/CheckinCalendar.tsx`

### References
- [Source: planning/epics/12-economy.md#ZY-12-08]

### 测试标准
- 单元：streak 重置 / 补签
- e2e：连签 7 天 / 漏签 / 补签

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

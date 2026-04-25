# Story 3.7: 设置中心

Status: ready-for-dev

## Story

As a 登录用户,
I want 在设置中心持久化我的主题、通知偏好、学习提醒、HSK 自评 / 测试入口,
so that 应用按我的偏好工作。

## Acceptance Criteria

1. `GET /v1/me/preferences` 返回结构化 preferences；`PATCH /v1/me/preferences` 部分更新；存 `users.preferences` (jsonb)。
2. preferences schema（zod）：
   - `theme: 'light' | 'dark' | 'system'`
   - `notifications: { push: bool, email: bool, learning_reminders: bool }`
   - `learning_reminder_time: 'HH:MM'`（用户本地时区）
   - `learning_reminder_timezone: IANA tz`
   - `hsk_self_rated_level: 0-9 | null`
   - `hsk_test_completed_at: ISO 时间 | null`
3. 主题偏好与前端 ThemeProvider（2-4）双向同步：登录后覆盖 localStorage。
4. 学习提醒：worker 每分钟扫描 due 用户 → 推送（push token 在 v1.5）/ email；本 story 实施 email 链路占位 + 配置存储。
5. HSK 自评：录入即写 `hsk_self_rated_level`；HSK 测试入口跳转 LE 模块（v1.5 完整）；本 story 仅按钮 + 跳转。
6. 通知偏好生效：3-3 异常登录邮件、3-5 找回密码邮件不受 `email` 通知 toggle 影响（安全邮件强制发）。
7. 测试：CRUD / zod 校验 / 时区 / 默认值。

## Tasks / Subtasks

- [ ] Task 1: preferences API（AC: #1, #2）
  - [ ] migration `0010_users_preferences_jsonb.sql`（如未在 3-1 加）
- [ ] Task 2: 前端联动（AC: #3）
  - [ ] `useTheme` 检测 me.preferences.theme
- [ ] Task 3: 学习提醒占位（AC: #4）
  - [ ] BullMQ repeat job 调度
  - [ ] 仅记录 + 发占位 email；推送在 v1.5
- [ ] Task 4: HSK 入口（AC: #5）
- [ ] Task 5: 邮件 toggle 强制例外（AC: #6）
- [ ] Task 6: 测试（AC: #7）

## Dev Notes

### 关键约束
- 时区用 IANA；Luxon / date-fns-tz 处理
- preferences 是 jsonb，全字段覆盖默认值合并
- 学习提醒 worker 每分钟扫一次成本可控，规模上来后改为 cron 分桶

### 依赖链
- 依赖：3-1, 3-3, 3-6, 2-4
- 被依赖：3-10

### Project Structure Notes
```
apps/api/src/
  routes/me/preferences.ts
  workers/learning-reminder.ts
  lib/preferences-defaults.ts
```

### References
- [Source: planning/epics/03-user-account.md#ZY-03-07](../../epics/03-user-account.md)
- [Source: planning/ux/09-screens-app.md](../../ux/09-screens-app.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

# Story 14.11: 邀请通知 + 月度排行榜

Status: ready-for-dev

## Story

作为 **分销员**，
我希望 **在新下线注册、付费 confirmed 入账时收到通知，并能查看月度榜单参与社交激励**，
以便 **持续感知收益、被正向激励、形成传播飞轮**。

## Acceptance Criteria

1. **新下线注册通知**（站内 + 邮件）：
   - 触发：14-5 bindParent 成功（is_suspicious=false）。
   - 站内 type=`referral_new_recruit`，title「{脱敏名} 注册了，期待 TA 的首次付费！」。
   - 邮件可关 (`notification_preferences.referral_email`=false)。
2. **下线付费 confirmed 通知**（站内 + 邮件 + push）：
   - 触发：14-7 cron issued 后立即。
   - 站内 type=`referral_commission_issued`，title「{脱敏名} 付费成功，您已获得 {amount_coins} ZC」。
   - 邮件 + push 默认开。
3. **下线退款反向通知**（站内 + 邮件）：
   - 触发：14-8 reverse 后立即。
   - 站内 type=`referral_commission_reversed`，title「订单退款，{amount_coins} ZC 已扣回」。
4. **suspicious 通知**：
   - 触发：14-10 冻结操作。
   - 站内 type=`referral_appeal_invite`，附申诉链接。
5. **月度排行榜**：
   - 表 `referral_monthly_leaderboards`（year_month / rank / user_id / total_recruits / total_issued_coins / display_name_masked / avatar_url / created_at）。
   - cron 每月 1 日 UTC 04:00 计算上月 Top 100，写入。
   - 路由 `/leaderboard/referral`（公开）展示当前月（Top 50）+ 上月归档。
   - 按 total_issued_coins desc 排；并列按 total_recruits desc。
6. **榜单脱敏**：display_name 仅首 2 字 + `****`；avatar 走 anonymized 头像（可关闭）。
7. **本人位置**：登录态在榜单底部显示「您当前排名 #N，距上一名 X ZC」。
8. **隐私开关**：`/me/settings/privacy` 可勾选「不进入排行榜」→ leaderboard 计算时跳过。
9. **i18n** 4 语 + 时间戳格式化。
10. **观测**：通知发送量 / 失败率 / 榜单生成时长。

## Tasks / Subtasks

- [ ] **通知 type 注册**（AC: 1-4）
  - [ ] `packages/notifications/types/referral.ts`
  - [ ] 4 模板（mjml）
  - [ ] push payload builder

- [ ] **触发点接入**（AC: 1-4）
  - [ ] 14-5 bindParent → emit
  - [ ] 14-7 cron issued → emit
  - [ ] 14-8 reverseCommission → emit
  - [ ] 14-10 freeze → emit

- [ ] **leaderboard schema + cron**（AC: 5,8）
  - [ ] `referral_monthly_leaderboards` 表
  - [ ] `apps/api/src/crons/referral-monthly-leaderboard.ts`

- [ ] **排行榜页**（AC: 5,6,7）
  - [ ] `apps/app/src/routes/leaderboard/referral.tsx`

- [ ] **隐私开关**（AC: 8）
  - [ ] `users.referral_leaderboard_opt_out` 列
  - [ ] `/me/settings/privacy` UI

- [ ] **i18n + 观测**（AC: 9,10）

## Dev Notes

### 关键约束
- 榜单只展示 issued 数（不包含 pending），避免「假成绩」。
- 月度榜锁定后不再回溯调整（即使 reverse 也保留榜上数据 + 注脚「含已反向」）。
- 通知频率上限：同一类型同一用户 1h 内合并（如批量注册时不刷屏）。

### 关联后续 stories
- 14-5 / 14-7 / 14-8 / 14-10 触发
- 14-9 dashboard 链接到 leaderboard
- E20 push 服务

### Project Structure Notes
- `packages/notifications/types/referral.ts`
- `packages/email/templates/referral-*.mjml`
- `apps/api/src/crons/referral-monthly-leaderboard.ts`
- `apps/app/src/routes/leaderboard/referral.tsx`

### References
- `planning/epics/14-referral.md` ZY-14-11

### 测试标准
- 单元：通知合并逻辑
- 集成：4 触发点全链
- E2E：leaderboard 月切换 + opt-out
- 性能：cron 100k users < 30s

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

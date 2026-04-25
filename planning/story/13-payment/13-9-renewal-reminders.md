# Story 13.9: 续费提醒

Status: ready-for-dev

## Story

作为 **付费订阅用户**，
我希望 **在续费前与失败续费时收到清晰提醒**，
以便 **不会因为忘记而中断学习，或因卡过期而丢失会员权益**。

## Acceptance Criteria

1. 提醒触发点：
   - **续费前 7 天**：`subscriptions.next_billing_at - now()` 在 6.5d-7.5d 之间 → 发送「即将续费」邮件 + 站内通知。
   - **续费前 1 天**：同上 0.5d-1.5d → 发送「明日续费」邮件 + push（APNs/FCM）+ 站内。
   - **续费失败**：webhook `subscription_payment_failed` → 立即邮件 + 站内 + push「支付失败，请更新支付方式」。
   - **Grace period 期间**：失败后第 1 / 3 / 7 天再次发送，第 7 天最终通知「3 天内未更新即取消」。
2. cron `subscription-reminders` 每小时跑：扫描候选订阅、按时区敏感（用户 timezone 字段）的本地 9-21 时发送。
3. 模板 4 语 i18n（zh / en / vi / th / id）；包含套餐名 / 金额 / 下次扣款日 / 「管理订阅」CTA → 跳 `/account/billing`。
4. 用户 `notification_preferences` 关闭 billing 邮件 → 仅站内 + push（站内不可关闭）。
5. 幂等：同一 subscription + 同一类型提醒 24h 内仅发一次（表 `subscription_reminder_logs`）。
6. push 通道：调 E20 push 服务；失败回退仅邮件。
7. 终身套餐不发任何续费提醒。
8. 已取消（cancel_at != null）：在剩余期内仅发「即将到期」一次（到期前 3 天），不发续费失败。
9. 监控：每日发送量 + bounce 率；bounce > 5% 告警。
10. 测试：可由 admin 触发「测试发送」到自身邮箱（限 5 次/h）。

## Tasks / Subtasks

- [ ] **schema**（AC: 5）
  - [ ] `subscription_reminder_logs` 表
- [ ] **cron**（AC: 1,2）
  - [ ] `apps/api/src/crons/subscription-reminders.ts`
  - [ ] 时区窗口过滤
- [ ] **handler 模板**（AC: 3,4）
  - [ ] Email templates `subscription-reminder-{type}.{lang}.mjml`
  - [ ] Push payload builder
  - [ ] 站内 notification type 注册
- [ ] **失败重试**（AC: 6）
  - [ ] BullMQ 队列
- [ ] **观测**（AC: 9）
  - [ ] Prometheus counter / histogram
- [ ] **admin 测试入口**（AC: 10）

## Dev Notes

### 关键约束
- 用户时区取自 `users.timezone`（E03），缺失则按 country_code 推断。
- 模板必须包含取消订阅 link（CAN-SPAM 合规）。
- 一次性 / 充值包不属于本 story。

### 关联后续 stories
- 13-3 webhook payment_failed 触发
- 19 observability 提供 metrics

### Project Structure Notes
- `apps/api/src/crons/subscription-reminders.ts`
- `packages/email/templates/subscription-reminder-*.mjml`
- `packages/db/schema/subscription-reminder-logs.ts`

### References
- `planning/epics/13-payment.md` ZY-13-09

### 测试标准
- 单元：时区窗口边界
- 集成：模拟 next_billing_at 7d ago / 1d ago / failure 触发
- E2E：bounce 模拟邮件 + push 双通道

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

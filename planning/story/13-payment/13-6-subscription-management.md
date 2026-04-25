# Story 13.6: 订阅管理（个人页）

Status: ready-for-dev

## Story

作为 **已付费用户**，
我希望 **在 `/account/billing` 查看订阅状态并执行取消 / 续费切换 / 升级降级**，
以便 **完全自助管理订阅，无需联系客服**。

## Acceptance Criteria

1. 页面 `/account/billing` 拉 `GET /api/me/subscription`：返回 plan / status / current_period_end / next_billing_at / cancel_at / vendor / invoice_history（最近 12 条 payment_orders）。
2. 状态卡片显示：套餐名 + 状态徽章（active / trialing / past_due / canceled / paused）+ 下次扣款时间 + 金额 + vendor logo。
3. 操作按钮：
   - **取消订阅**：弹挽留 modal（赠 7 天延期？降级？）→ 确认后调 `POST /api/me/subscription/cancel`，立即标 `cancel_at=current_period_end`，订阅持续到期末；UI 改显示「将于 YYYY-MM-DD 到期」。
   - **恢复订阅**：取消未到期 → `POST /api/me/subscription/resume`，清 cancel_at。
   - **升级**：月→年 / 年→终身：弹差价确认（Paddle `prorate=true`）→ 调 `POST /api/me/subscription/change-plan`；vendor API 处理按比例计费 + webhook 落库。
   - **降级**：年→月：在期末生效，立即 schedule。
4. 升级 / 降级仅限 Paddle 通道；LemonSqueezy 提示「请取消后重新订阅」。
5. 过期提醒：UI 顶部 `current_period_end - now < 7d` 显示橙色横幅；`< 1d` 红色 + 续费按钮。
6. `past_due`：显示「支付失败」红色卡片 + 更新支付方式 CTA（Paddle update payment URL）。
7. invoice_history 列表：日期 / 金额 / 状态 / 下载 PDF（Paddle hosted invoice link，LS 同理）。
8. 所有写操作需重新认证（密码或邮件 OTP，14 天内免重）。
9. 全程 4 语 i18n；操作完成 toast；失败显示明确错误。

## Tasks / Subtasks

- [ ] **后端订阅管理 API**（AC: 1,3,6）
  - [ ] `apps/api/src/routes/me/subscription.ts`
  - [ ] cancel / resume / change-plan / fetch
  - [ ] 调 Paddle Subscription API；LS 兼容只读

- [ ] **挽留 modal**（AC: 3）
  - [ ] `apps/app/src/features/billing/CancelRetentionModal.tsx`
  - [ ] 选项：保留并赠 7 天 / 降级到月 / 真的取消

- [ ] **升降级流程**（AC: 3,4）
  - [ ] 调 Paddle preview API 显示差价
  - [ ] 确认后 commit；轮询 webhook

- [ ] **过期 / past_due 横幅**（AC: 5,6）
  - [ ] 通用 `BillingAlertBanner` 组件

- [ ] **invoice_history**（AC: 7）
  - [ ] 表格组件 + PDF 链接打开新窗口

- [ ] **重认证**（AC: 8）
  - [ ] 复用 E03 step-up auth 中间件

## Dev Notes

### 关键约束
- 取消是「期末取消」（cancel_at），不是立即；UI 必须明示。
- Paddle proration 默认 prorated_immediately；UI 文案要解释。
- 终身套餐没有续费 / 取消按钮，仅显示「永久会员」+ 购买日期。

### 关联后续 stories
- 13-7 退款由后台触发，本页面不直接退款
- 13-9 续费提醒邮件落地此页面

### Project Structure Notes
- `apps/app/src/routes/account/billing.tsx`
- `apps/app/src/features/billing/`
- `apps/api/src/routes/me/subscription.ts`

### References
- `planning/epics/13-payment.md` ZY-13-06
- Paddle Subscription Update API

### 测试标准
- 集成：取消 → resume → 状态正确
- E2E：升级月→年 webhook 落库后 UI 更新
- 视觉：past_due / canceled / active 三态截图

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 14.9: 仪表板 /me/referral

Status: ready-for-dev

## Story

作为 **分销员（任意用户）**，
我希望 **在 `/me/referral` 一站式查看分享链接、累计佣金（ZC）、推荐人列表、30 天曲线**，
以便 **直观追踪自己的邀请效果，且单位明确为 ZC、永远不出现 USD / 提现入口**。

## Acceptance Criteria

1. 路由 `/me/referral`（登录态）顶部「邀请」卡片复用 14-3 ShareCard。
2. 数据卡片三栏：
   - **累计已发放 ZC**（status=issued 的 amount_coins SUM）。
   - **待确认 ZC**（pending + confirmed SUM）。
   - **已反向 ZC**（reversed + partial_reversed 的 SUM 绝对值，灰色）。
3. **明确单位 ZC**：所有数字后缀「ZC」+ tooltip「知语币（不可提现，可在商城消费）」。
4. **30 天佣金曲线**：折线图（issued / pending）按日；时区按用户 timezone。
5. **L1 / L2 推荐人列表**：
   - 表格：脱敏名 + 注册日期（脱敏到日，如 2026-04）+ L1/L2 标签 + 该人累计带来 ZC。
   - 分页（20/页）；按累计 ZC desc 默认。
   - 不显示 user_id / email / 完整 name。
6. **API**：
   - `GET /api/me/referral/dashboard` 一次返回所有上述数据；P95 < 500ms。
   - 内部物化视图 `mv_referral_dashboard_user`（每 15min 刷新）+ 实时 delta（最近 24h 实时算）。
7. **不显示纯 code**：UI 任何位置不显示 6 位 code 字符串；URL 中存在但不突出展示。
8. **不显示 USD / 提现 / 银行 / PayPal**：UI / 文案 / 帮助链接全部审查通过。
9. 历史记录页 `/me/referral/history` 列出近 90 天 commissions 明细（status / amount_coins / order_id 脱敏 / created_at）；分页。
10. 响应式：桌面 3 栏，移动堆叠；曲线在移动横滑可看。
11. i18n 4 语；A11y axe 0 violations。

## Tasks / Subtasks

- [ ] **dashboard API**（AC: 6）
  - [ ] `apps/api/src/routes/me/referral/dashboard.ts`
  - [ ] 物化视图 + delta SQL

- [ ] **history API**（AC: 9）
  - [ ] `apps/api/src/routes/me/referral/history.ts`

- [ ] **前端页面**（AC: 1-5,7,8,10,11）
  - [ ] `apps/app/src/routes/me/referral/index.tsx`
  - [ ] `apps/app/src/routes/me/referral/history.tsx`
  - [ ] `<DashboardCards />`, `<CommissionChart />`, `<RecruitsTable />`

- [ ] **物化视图**（AC: 6）
  - [ ] `packages/db/views/mv_referral_dashboard_user.sql`
  - [ ] cron 刷新

- [ ] **审查 UI**（AC: 7,8）
  - [ ] checklist 自动化测试：grep 页面文本无 `code` / `USD` / `withdraw`

- [ ] **i18n + a11y**（AC: 11）

## Dev Notes

### 关键约束
- 单户年累计 200,000 ZC 上限：仪表板显示「今年已得 X / 200,000 ZC」进度条。
- 反向 ZC 显示为负数 + 灰色，不要红色（避免引起恐慌）。
- 不要把 `inviter_user_id` 暴露到前端；前端只用 anonymous masked display。

### 关联后续 stories
- 14-3 ShareCard 嵌入
- 14-11 通知点击跳本页

### Project Structure Notes
- `apps/api/src/routes/me/referral/dashboard.ts`
- `apps/api/src/routes/me/referral/history.ts`
- `apps/app/src/routes/me/referral/`
- `packages/db/views/mv_referral_dashboard_user.sql`

### References
- `planning/epics/14-referral.md` ZY-14-09
- `planning/prds/09-referral/01` RF-FR-009

### 测试标准
- 集成：dashboard P95 500ms / 1M commissions
- 视觉：4 语 + 桌面/移动 截图回归
- A11y：axe
- 安全：UI 文本审查脚本通过
- Contract：API 响应不含 `code` / `usd` / `withdraw` 键

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

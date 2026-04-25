# Story 14.7: 14 天确认 cron + 自动入账 ZC

Status: ready-for-dev

## Story

作为 **平台**，
我希望 **每日扫描 14 天前的 pending 佣金并自动确认 + 调 economy.issue 入账 ZC**，
以便 **避免人工干预、用户体验顺畅，且对 suspicious / frozen 关系跳过 confirm**。

## Acceptance Criteria

1. cron `referral-commission-confirm` 每日 UTC 03:00 跑一次。
2. 扫描候选：`SELECT * FROM referral_commissions WHERE status='pending' AND pending_until <= now()`。
3. 每条候选：
   - 查 `referral_relations` 是否 `is_suspicious=true` 或 beneficiary 被冻结 → status='frozen' 不发放，加 metadata reason。
   - 否则：
     a. 调 `economy.issue(beneficiary_user_id, amount_coins, source='referral_commission', source_id=commission.id)` → 写 `coins_ledger`。
     b. 更新 `referral_commissions.status='issued'` + `coins_ledger_id` + `updated_at`。
     c. 触发 14-11 通知。
4. 失败重试：
   - economy.issue 失败 → 标 status='confirmed'（中间态：已确认未发放）+ 加入重试队列。
   - 队列指数退避 1m / 5m / 30m / 2h / 1d，6 次后告警 + 人工接手。
5. 批量处理：每次 cron 处理上限 5000 条；超过下次再来。
6. 幂等：以 commission.id 为锚；重复运行不双发（economy.issue 内部用 source_id 去重）。
7. 性能：5000 条处理 < 5min；DB 锁 SELECT FOR UPDATE SKIP LOCKED 避免并发。
8. 状态机合法转移：pending → confirmed → issued / frozen / reversed；非法转移抛错。
9. 后台手动触发：admin 可对单条 commission 强制 issue 或 freeze（审计落 `admin_audit_logs`）。
10. 监控：日 confirm 量 / 失败数 / 队列堆积；堆积 > 100 告警。

## Tasks / Subtasks

- [ ] **cron 主逻辑**（AC: 1,2,3,5,7）
  - [ ] `apps/api/src/crons/referral-commission-confirm.ts`
  - [ ] `FOR UPDATE SKIP LOCKED` 取锁

- [ ] **issue 集成**（AC: 3）
  - [ ] 调用 E12 `economy.issue`
  - [ ] 处理已发放幂等（economy 内部）

- [ ] **失败队列**（AC: 4）
  - [ ] BullMQ queue `referral-commission-issue`

- [ ] **状态机守卫**（AC: 8）
  - [ ] `packages/referral/state-machine.ts`

- [ ] **admin 手动**（AC: 9）
  - [ ] `apps/admin/src/routes/referral/commissions.tsx` + API

- [ ] **监控**（AC: 10）
  - [ ] Prometheus + alert rule

## Dev Notes

### 关键约束
- 「14 天」是为了与 Paddle 退款窗口对齐（行业惯例 ≤14d）。
- frozen 后不会自动恢复；需 14-10 申诉通过后 admin 手动 reissue。
- economy.issue 受 EC 月发行 50k 上限影响吗？→ 不受。referral 单独走 source='referral_commission'，不计入 EC 上限（已在 14-1 关键约束声明）。
- 用户单年 200k ZC 上限在 14-6 已拦截，此处再次校验保险。

### 关联后续 stories
- 14-8 退款 → 14-7 已 issued 也会被 reverse
- 14-10 frozen
- 14-11 通知

### Project Structure Notes
- `apps/api/src/crons/referral-commission-confirm.ts`
- `apps/api/src/workers/referral-issue.ts`
- `packages/referral/state-machine.ts`

### References
- `planning/epics/14-referral.md` ZY-14-07

### 测试标准
- 单元：状态机非法转移
- 集成：5000 条 happy path < 5min
- 故障：economy.issue 抛错 → 队列重试

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

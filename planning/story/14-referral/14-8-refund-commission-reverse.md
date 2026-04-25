# Story 14.8: 退款 → 佣金反向

Status: ready-for-dev

## Story

作为 **平台**，
我希望 **订单退款时关联的所有佣金被精准反向（pending 标 reversed / issued 写负 ledger）**，
以便 **避免邀请人套利「先付后退」获得无根 ZC，并保持 ledger 可审计**。

## Acceptance Criteria

1. 监听 `order.refunded` 事件（13-3 / 13-4 webhook 已 emit），调用 `commissionService.reverseCommission(orderId, refundAmountCents, reason)`。
2. 加载 `referral_commissions WHERE order_id=orderId`：
   - **pending**：直接标 status='reversed'，pending_until 失效。
   - **confirmed**：标 status='reversed'（confirm 中间态）。
   - **issued**：调 `economy.issue(beneficiary, -amount_coins, source='referral_commission_reversed', source_id=commission.id)` 写**负数** ledger 行；标 status='reversed'。
   - **frozen / reversed**：跳过（已为 0）。
3. **部分退款**：refundAmountCents < paymentOrders.amount_usd_cents → 按比例反向：
   - `reverse_amount = round(commission.amount_coins × (refundAmountCents / order.amount_usd_cents))`。
   - 写部分负值；commission 标 status='partial_reversed'，metadata 记 reverse_amount。
4. **负余额允许**：用户 `coins_balances` 可为负（标 `owed=true`）；后续 economy.issue 优先抵扣。
5. **多级反向**：L1 + L2 都反；二者独立处理。
6. **幂等**：以 commission.id 为锚 + reversal_event_id（event payload 中携带）；重放不重复负数。
7. **通知**：reverse 完成 → 站内通知 + 邮件「您的 X ZC 佣金已因订单退款扣回」（14-11 模板）。
8. **审计**：写 `referral_anti_cheat_logs`（如果同一邀请人短期内多次反向，标 suspicious）。
9. **状态机**：合法转移 pending/confirmed/issued/partial_reversed → reversed；非法转移抛错。
10. 监控：每日 reverse 量 / partial 量 / 异常率。

## Tasks / Subtasks

- [ ] **reverseCommission**（AC: 1,2,3,5,6）
  - [ ] `packages/referral/services/commission.ts` 增加 reverseCommission
  - [ ] 状态分支处理

- [ ] **负 ledger 写入**（AC: 4）
  - [ ] economy.issue 接受负数（E12 已支持）
  - [ ] coins_balances `owed` 字段更新

- [ ] **事件订阅**（AC: 1）
  - [ ] subscribe Redis pub/sub `order.refunded`

- [ ] **通知模板**（AC: 7）
  - [ ] 4 语 email + 站内 type=referral_reversed

- [ ] **审计扩展**（AC: 8）
  - [ ] suspicious 检测规则：同 inviter 30d 内 reversed ≥5 笔 → 标

- [ ] **状态机**（AC: 9）

- [ ] **监控**（AC: 10）

## Dev Notes

### 关键约束
- partial_reversed 是新状态；14-1 schema 状态枚举需加（M1 之前补 migration 即可）。
- 反向不需要二次确认：webhook 触发即生效。
- 若用户已经将 ZC 消费（economy 余额不足以反向）→ 仍写负 ledger，余额变负。

### 关联后续 stories
- 13-7 退款 → 13-3 webhook → emit
- 14-7 cron 已发放也可 reverse
- 14-11 通知
- 14-10 suspicious 监控

### Project Structure Notes
- `packages/referral/services/commission.ts`
- `packages/referral/state-machine.ts`
- `packages/email/templates/referral-reversed-*.mjml`

### References
- `planning/epics/14-referral.md` ZY-14-08

### 测试标准
- 单元：3 状态各自反向；部分退款比例
- 集成：webhook → reverse → ledger 负行可见
- E2E：完整 paid → confirmed → issued → refund → reversed

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

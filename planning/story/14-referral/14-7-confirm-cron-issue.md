# ZY-14-07 · 14 天确认 cron + 自动入账 + 退款反向

> Epic：E14 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] worker BullMQ repeatable daily cron：扫 14 天前 pending → confirmed
- [ ] 调 `economy.issue(beneficiary, amount_coins, source='referral_commission')`
- [ ] 写 `coins_ledger_id` 回 `referral_commissions`；状态 pending → confirmed → issued
- [ ] `reverseCommission`：pending → reversed；confirmed/issued → 写负数 ledger（账户标 `owed=true`）
- [ ] EmailAdapter（fake）通知用户 issue 入账

## 测试方法
- 集成：mock 时间 +14d → cron 触发 → ZC 入账可见
- 退款链路：负数 ledger 出现

## DoD
- [ ] 全链路通；不丢失

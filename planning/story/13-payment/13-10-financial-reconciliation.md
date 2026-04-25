# Story 13.10: 财务对账

Status: ready-for-dev

## Story

作为 **财务 / 运营管理员**，
我希望 **每日自动从 Paddle / LemonSqueezy 拉取流水并与本地订单比对、差异告警**，
以便 **保证财务数据可信、审计合规、问题早发现**。

## Acceptance Criteria

1. 每日 cron（UTC 02:00）拉取昨日（T-1）Paddle / LemonSqueezy 全部 transactions / refunds 写入 `vendor_transactions_raw`（id / vendor / vendor_event_id unique / type / amount_cents / currency / status / fees_cents / payout_cents / customer_email / occurred_at / payload_jsonb）。
2. 对账匹配规则：
   - 主匹配 `vendor_event_id ↔ payment_orders.vendor_order_id`。
   - 次匹配（漏匹配时）：amount + customer_email + occurred_at±10min。
3. 对账结果落 `reconciliation_results`（date / vendor / matched_count / unmatched_local_count / unmatched_vendor_count / amount_diff_cents / status：clean | warning | error / report_url）。
4. 差异类型分类：
   - 本地 paid 但 vendor 无对应 → `local_orphan`（可能 webhook 重复 / 误标）。
   - vendor 有但本地无 → `vendor_orphan`（webhook 丢失，需重放）。
   - 金额不一致（FX 漂移除外）→ `amount_mismatch`。
   - 状态不一致（如本地 paid，vendor refunded）→ `status_mismatch`。
5. 自动修复：
   - `vendor_orphan` → 自动 enqueue 13-3 / 13-4 webhook 重放任务。
   - 其他 → 仅告警，不自动改本地状态（防止误操作）。
6. 后台 `/admin/finance/reconciliation`：
   - 日报表表格（按 vendor + 状态）。
   - 差异详情下钻（可链到 `payment_orders` / vendor_transactions_raw）。
   - 手动「标记已处理」+ 备注。
7. 告警：amount_diff > $100 或 unmatched > 5 笔 → Slack #alerts-finance + 邮件 finance@。
8. 月度汇总报表：每月 1 日生成上月 PDF/CSV，含总营收 / 退款 / 净额 / fees / payout，下载到对象存储 30 天。
9. 历史保留：`vendor_transactions_raw` 保留 7 年（合规）；`reconciliation_results` 保留 7 年。
10. 可重跑：admin 可对指定日期手动触发对账（防止冷启动 / 修复后重算）。

## Tasks / Subtasks

- [ ] **schema**（AC: 1,3,9）
  - [ ] `vendor_transactions_raw`
  - [ ] `reconciliation_results`
- [ ] **拉取 cron**（AC: 1）
  - [ ] `apps/api/src/crons/payment-reconcile.ts`
  - [ ] Paddle list-transactions + LS list-orders 分页
- [ ] **匹配引擎**（AC: 2,4）
  - [ ] `packages/payment/reconcile/match.ts`
- [ ] **自动修复**（AC: 5）
  - [ ] vendor_orphan → 13-3 webhook 重放队列
- [ ] **后台 UI**（AC: 6,10）
  - [ ] `apps/admin/src/routes/finance/reconciliation.tsx`
- [ ] **告警**（AC: 7）
  - [ ] Slack webhook + email digest
- [ ] **月度汇总**（AC: 8）
  - [ ] cron `monthly-finance-report` + PDF 生成 + R2/S3 上传

## Dev Notes

### 关键约束
- FX 漂移容差：USD 主币种，本地币种 ±0.5% 视为相等。
- 重跑必须幂等（vendor_event_id unique）。
- 月度报表生成需在 UTC 月初 04:00 之后（避免与日 cron 抢锁）。

### 关联后续 stories
- 17 admin 提供 RBAC `finance:reconcile`
- 19 observability 接 metrics
- 13-3 / 13-4 webhook 重放

### Project Structure Notes
- `apps/api/src/crons/payment-reconcile.ts`
- `apps/api/src/crons/monthly-finance-report.ts`
- `packages/payment/reconcile/`
- `apps/admin/src/routes/finance/`

### References
- `planning/epics/13-payment.md` ZY-13-10

### 测试标准
- 单元：4 种差异分类
- 集成：mock Paddle + LS 各 1000 笔 + 故意丢 5 笔 → 报表正确
- E2E：admin 重跑指定日期

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 14.1: referral_codes / referral_relations / referral_commissions 表 + RLS

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立分销系统的三张核心表（不含 withdraw / balances）**，
以便 **后续邀请码、上级绑定、佣金计算、确认与反向、仪表板等所有 stories 有数据基座，且永久杜绝现金提现接口**。

## Acceptance Criteria

1. Drizzle schema 创建表：`referral_codes`、`referral_relations`、`referral_commissions`，主键 uuid v7。
2. **`referral_codes`**：id / user_id (FK users, unique) / code (text unique，6 位，大写字母+数字，**禁用** 0/O/1/I/L) / created_at；不可变，无 status / regenerate 接口。
3. **`referral_relations`**：id / child_user_id (FK users, unique) / l1_user_id (FK users, NOT NULL) / l2_user_id (FK users, nullable) / source_ip (inet) / source_device_id (text) / source_country (text) / is_suspicious (bool default false) / suspicious_reason (text) / created_at。索引：(l1_user_id, created_at desc)、(l2_user_id, created_at desc)。
4. **`referral_commissions`**：id / order_id (FK payment_orders) / beneficiary_user_id (FK users) / level (1|2) / amount_coins (INT，单位 ZC，**禁止存在 USD 字段**) / status (pending | confirmed | issued | reversed | frozen) / pending_until (timestamptz, T+14d) / coins_ledger_id (FK coins_ledger nullable) / reversal_reason (text nullable) / created_at / updated_at。唯一索引 (order_id, level)；索引 (beneficiary_user_id, status, created_at desc)、(status, pending_until)。
5. **绝对禁止**：不创建 `referral_withdrawals` / `referral_balances` 表；不创建 `cash_balance` / `usd_amount` 字段。Migration 与 schema 中显式注释「现金提现已永久取消」。
6. RLS：
   - `referral_codes`: 用户仅能 SELECT 自己（`auth.uid() = user_id`），无 UPDATE / DELETE / INSERT 用户权限（仅 service_role）。
   - `referral_relations`: 用户仅能 SELECT 自己作为 child / l1 / l2 的行；写仅 service_role。
   - `referral_commissions`: 用户仅能 SELECT 自己 beneficiary 的行；写仅 service_role。
7. 旧端点防呆：在 router 层注册 `/api/me/referral/withdraw` / `/api/me/referral/code/regenerate` / `/api/me/referral/code` 直接返回 410 Gone（含 deprecation 文档链接），不可被路由到任何 handler。
8. 索引性能：`SELECT … FROM referral_commissions WHERE beneficiary_user_id=? ORDER BY created_at DESC LIMIT 50` 在 1M 行下 P95 < 80ms。

## Tasks / Subtasks

- [ ] **Schema + migration**（AC: 1-5）
  - [ ] `packages/db/schema/referral.ts`
  - [ ] migration `20260815_referral_tables.sql` 含明确注释禁止 withdraw 表
  - [ ] CHECK 约束：amount_coins INT，level IN (1,2)

- [ ] **RLS 策略**（AC: 6）
  - [ ] 三张表 SELECT policy
  - [ ] 写策略仅 service_role

- [ ] **410 Gone 路由**（AC: 7）
  - [ ] `apps/api/src/routes/_deprecated/referral.ts`
  - [ ] 集成测试断言 410

- [ ] **索引验证**（AC: 8）
  - [ ] EXPLAIN ANALYZE
  - [ ] 1M 行造数脚本

## Dev Notes

### 关键约束
- ZC = 知语币（INT），1 ZC ≈ 1 美分量级（按运营调整）。佣金率 L1=20%、L2=20%（订单 USD cents × 100 × 0.2 → ZC）。
- L2 派生：相关用户的 `referral_relations.l1` 即下一代的 `l2`。
- pending_until 在 14-6 写入时计算 = paid_at + 14d。
- 任何位置（API / 日志 / 监控）禁止打印纯 code 文本；只允许打印 `code_id`（即 referral_codes.id）。

### 关联后续 stories
- 14-2 写入 referral_codes（注册钩子）
- 14-4 / 14-5 写入 referral_relations
- 14-6 写入 referral_commissions
- 14-7 cron 改 status pending → confirmed → issued
- 14-8 reversed
- 14-9 dashboard 读

### Project Structure Notes
- `packages/db/schema/referral.ts`
- `packages/db/migrations/20260815_referral_tables.sql`
- `apps/api/src/routes/_deprecated/referral.ts`

### References
- `planning/epics/14-referral.md` ZY-14-01
- `planning/prds/09-referral/02`
- `planning/sprint/14-referral.md` 关键约束

### 测试标准
- 单元：CHECK 约束阻止非法 level / status
- 集成：RLS 越权访问被拒；410 端点确实返回 410
- 性能：1M 行 P95 测试

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

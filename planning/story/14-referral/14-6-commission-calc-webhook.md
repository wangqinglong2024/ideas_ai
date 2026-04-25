# Story 14.6: 佣金计算（订单 webhook → pending）

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **订单支付成功事件触发佣金 pending 落库（L1 + L2 各 20%）**，
以便 **14 天后由 cron（14-7）自动 confirm + 入账 ZC，且对退款（14-8）可反向**。

## Acceptance Criteria

1. 订阅 / 一次性付款 webhook → emit `order.paid`（13-3 / 13-4 已就绪）→ `commissionService.onOrderPaid(orderId)` 监听。
2. 处理流程：
   - 加载 `payment_orders`：取 `user_id`(child)、`amount_usd_cents`。
   - 查 `referral_relations` WHERE child_user_id=user_id → 取 l1, l2。
   - 计算 `amount_coins = round(amount_usd_cents × 0.20)`（USD cents × 0.2 = ZC，1 cent ≈ 1 ZC）。
   - L1（必有）→ INSERT pending（pending_until = paid_at + 14d）。
   - L2（可选）→ INSERT pending（同样 pending_until）。
3. **充值包不算佣金**：`payment_orders.type='coins_pack'` → 跳过（避免 ZC 套利）。
4. **退款 / refund 类型订单**：本 story 不处理（由 14-8 处理 reverseCommission）。
5. **suspicious 关系跳过 confirm**（14-7 实现），但本 story 仍写 pending（保留审计）；写入时附 metadata `relation_is_suspicious=true`。
6. **frozen 用户**：l1/l2 任一被冻结（14-10）→ 该 level 跳过 INSERT；记 anti-cheat log。
7. **幂等**：唯一索引 `(order_id, level)` 保证；重放 webhook 不重复创建；冲突静默 ack。
8. **单户年上限 200,000 ZC**：写入前检查 beneficiary 当年累计 confirmed+pending 是否会超限：
   - 超限 → 仅写最大可能值（部分），剩余写 `referral_commission_overflows` 表（信息记录，不入账）。
   - 上限按 UTC 自然年。
9. 性能：onOrderPaid 处理 P95 < 300ms；批量重放 1000 订单 < 60s。
10. 监控：每日新增 pending 量 / 平均 amount_coins / 超限拦截次数。

## Tasks / Subtasks

- [ ] **commissionService**（AC: 1,2,3,7）
  - [ ] `packages/referral/services/commission.ts`
  - [ ] `onOrderPaid(orderId)`

- [ ] **跳过逻辑**（AC: 3,4,5,6）
  - [ ] coins_pack 跳过
  - [ ] suspicious 写入但带 metadata
  - [ ] frozen 跳过 + log

- [ ] **年上限**（AC: 8）
  - [ ] `packages/referral/limits/yearly-cap.ts`
  - [ ] `referral_commission_overflows` 表

- [ ] **事件总线接入**（AC: 1）
  - [ ] subscribe Redis pub/sub `order.paid`

- [ ] **观测**（AC: 9,10）
  - [ ] Prometheus + dashboard

## Dev Notes

### 关键约束
- 1 美分 = 1 ZC 是 v1 约定；如未来调整，须改本计算 + UI 提示。
- pending_until 用 paid_at（vendor 结算时间），不用本地 created_at。
- L1 / L2 都拿 20%（不是 L2 拿 L1 的 20%）；总流出 = 40% × order_amount。

### 关联后续 stories
- 14-7 cron confirm
- 14-8 reverseCommission
- 14-10 freezing

### Project Structure Notes
- `packages/referral/services/commission.ts`
- `packages/referral/limits/yearly-cap.ts`
- `packages/db/schema/referral-commission-overflows.ts`

### References
- `planning/epics/14-referral.md` ZY-14-06
- `planning/prds/09-referral/01` RF-FR-006/007

### 测试标准
- 单元：幂等、年上限边界、suspicious 写入
- 集成：webhook → commission pending 全链
- 性能：1000 订单批量

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

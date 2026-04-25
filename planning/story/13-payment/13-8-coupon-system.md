# Story 13.8: 优惠券系统 v1

Status: ready-for-dev

## Story

作为 **运营 / 用户**，
我希望 **后台能生成折扣码、用户能在 Checkout 输入优惠码享受折扣**，
以便 **运营能做促销活动，用户能感知优惠**。

## Acceptance Criteria

1. 表 `coupons`：id / code（unique，大写字母+数字 6-12 位）/ type（percent | fixed_amount）/ value_bps（百分比基点 0-10000）或 value_cents（fixed）/ currency（fixed 用）/ applies_to（all | plan_codes[] JSON）/ max_redemptions / redeemed_count / per_user_limit / starts_at / ends_at / status（active|paused|expired）/ created_by。
2. 表 `coupon_redemptions`：id / coupon_id / user_id / order_id / redeemed_at；唯一 (coupon_id, user_id, order_id)。
3. 后台 `/admin/coupons` CRUD + 批量生成（如 1000 张唯一码 CSV 导出）；权限 `marketing:coupons`。
4. 应用规则：
   - 折扣作用于一次性（含充值包）+ 订阅首期；不作用于续费 / 升降级差价。
   - per_user_limit 默认 1；可设为 N。
   - 同一订单只能用一个 coupon。
5. Checkout 接口（13-2 / 13-4）接受 `coupon_code` → 校验：存在 / 状态 active / 未过期 / 未达 max_redemptions / 未达 per_user_limit / 适用 plan → 应用折扣。
6. Paddle / LS 集成：通过 vendor 的 `discounts` API 创建对应 vendor-side coupon（脚本同步）；在 Checkout 直接传 vendor discount_id。
7. 前端 `/pricing` 与 checkout flow 提供「输入优惠码」字段；实时校验（debounce 300ms）；展示折后价。
8. 退款（13-7）→ 对应 `coupon_redemptions` 记录 status=reversed，`redeemed_count` 递减。
9. 防滥用：同 IP / 设备指纹 24h 内尝试无效码 ≥ 10 → 暂时拒绝该客户端 1h（429）。
10. 审计：所有 coupon CRUD 落 admin_audit_logs。

## Tasks / Subtasks

- [ ] **Schema + RLS**（AC: 1,2）
- [ ] **后台 CRUD + 批量生成**（AC: 3）
  - [ ] `apps/admin/src/routes/coupons/`
  - [ ] CSV 导出
- [ ] **Checkout 集成**（AC: 5,6）
  - [ ] `packages/payment/coupons/validate.ts`
  - [ ] vendor discount 同步脚本
- [ ] **前端 UI**（AC: 7）
  - [ ] `<CouponInput />` 组件
- [ ] **退款回滚**（AC: 8）
  - [ ] 在 13-7 webhook handler 调用
- [ ] **防滥用 + 审计**（AC: 9,10）

## Dev Notes

### 关键约束
- value_bps：50% off → 5000；防止精度问题。
- fixed_amount 必须与订单 currency 一致（不做汇率换算）。
- 终身套餐限制：默认 applies_to 不含 lifetime，需运营显式开启。

### 关联后续 stories
- 13-2 / 13-4 checkout 注入
- 13-7 退款回滚 redemption
- E14 邀请文案可附带 coupon（v2）

### Project Structure Notes
- `packages/db/schema/coupons.ts`
- `packages/payment/coupons/`
- `apps/admin/src/routes/coupons/`
- `apps/app/src/features/payment/CouponInput.tsx`

### References
- `planning/epics/13-payment.md` ZY-13-08

### 测试标准
- 单元：校验 8 种失败原因明确返回 code
- 集成：批量生成 1000 码无冲突
- E2E：用码 → 折后价 → 支付完成 → redemption 记录

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

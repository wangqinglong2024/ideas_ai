# Story 12.4: 充值流程（接入 E13 支付）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **选购充值套餐并通过 Paddle / LemonSqueezy 完成支付后，账户自动到账知语币**，
以便 **快速补充余额**。

## Acceptance Criteria

1. `coins_recharge_packages(id, name, coins, bonus_coins, price_usd, currency, active, sort)` 表 + 5 种默认套餐 seed。
2. `GET /v1/coins/packages` 列表 API。
3. 充值入口：商城页 / 余额顶栏 / 付费墙触发。
4. 创建订单调用 E13 `createCheckout(packageId, userId)`，返回支付链接。
5. E13 webhook（13-3）支付成功后调用 `awardRechargeCoins(userId, packageId, orderId)`：写 ledger（source=recharge）+ 触发器到账。
6. 幂等：order_id 在 ledger.idempotency_key；重复 webhook 不重复发币。
7. 失败 / 退款：webhook 触发 `refundRechargeCoins`，写负向 ledger（如余额不足允许变 0，差额从 frozen 扣，再不足记录欠款审计）。
8. 4 语 UI；审计完整。

## Tasks / Subtasks

- [ ] 套餐表 + seed + API（AC: 1,2）
- [ ] 充值入口 UI（AC: 3）
- [ ] 创建订单 + 跳转（AC: 4）
- [ ] webhook 处理 + 到账（AC: 5,6）
- [ ] 退款 / 欠款审计（AC: 7）
- [ ] i18n + 测试

## Dev Notes

### 关键约束
- webhook 处理在 E13；本 story 提供 service 接口供其调用。
- 套餐价格走多币种（13-2 已支持），UI 展示按 locale 选币种。

### Project Structure Notes
- `packages/db/schema/coins-recharge.ts`
- `apps/api/src/services/coins/recharge.ts`
- `apps/web/src/components/coins/RechargePackages.tsx`

### References
- [Source: planning/epics/12-economy.md#ZY-12-04]
- [Source: planning/epics/13-payment.md]

### 测试标准
- 集成：模拟 webhook → 到账 / 退款

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

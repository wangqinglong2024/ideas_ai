# ZY-08-06 · 节完成结算 + 付费墙

> Epic：E08 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 结算页：正确率 / 时长 / XP / ZC、错题快速回顾
- [ ] 付费墙弹窗：套餐选择 → 调 `PaymentAdapter.createCheckout`
- [ ] ZC 解锁单节：调 `economy.spend(userId, lessonPrice, idem)`，成功后写 `entitlements`
- [ ] 升级动画（接 ZY-07-05）

## 测试方法
- MCP Puppeteer：未付费节 → 付费墙 → fake checkout → 解锁完成
- 单元：ZC 不足拒绝

## DoD
- [ ] 双路径解锁 OK

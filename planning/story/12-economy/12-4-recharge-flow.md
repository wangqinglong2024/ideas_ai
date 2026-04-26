# ZY-12-04 · 充值流程（接 PaymentAdapter）

> Epic：E12 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `coin_packs` 表（套餐：100/500/2000/5000 ZC）
- [ ] FE 套餐选择 → 调 `PaymentAdapter.createCheckout`
- [ ] PaymentAdapter `order.succeeded` 事件订阅 → 调 `economy.issue`
- [ ] 失败 / 退款 → 反向 ledger

## 测试方法
- MCP Puppeteer：fake checkout → ZC 入账可见
- 退款：余额回退

## DoD
- [ ] 充值 + 退款全闭环

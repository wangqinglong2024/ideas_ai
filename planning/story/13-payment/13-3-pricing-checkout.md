# ZY-13-03 · 套餐选择 UI + Checkout

> Epic：E13 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 月 / 年 / 终身 价目；推荐徽章
- [ ] 本地化货币展示（接 E04 ICU）
- [ ] 调 `PaymentAdapter.createCheckout` → fake 模式跳沙盒确认页
- [ ] 「已是会员」状态展示

## 测试方法
- MCP Puppeteer：选择 → fake 沙盒确认 → 会员状态可见

## DoD
- [ ] 价格页 + Checkout 完整链路

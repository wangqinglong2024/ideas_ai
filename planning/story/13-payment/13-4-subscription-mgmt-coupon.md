# ZY-13-04 · 订阅管理 + 退款 + 优惠券

> Epic：E13 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 个人页：当前订阅 / 取消 / 升降级 / 过期提醒
- [ ] 后台发起退款 → emit `order.refunded` → 触发 E14 反向佣金 + ZC 回收
- [ ] 简单 `coupons` 表 + 应用接口（百分比 / 固定金额）
- [ ] 取消保留到期前权益

## 测试方法
- MCP Puppeteer：订阅 → 取消 → 到期降级
- 集成：退款 → 反向 commission

## DoD
- [ ] 三动作 + 优惠码可用

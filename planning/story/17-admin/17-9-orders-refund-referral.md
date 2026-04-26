# ZY-17-09 · 订单 / 退款 / 分销视图

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 订单列表 + 详情；按 provider 筛选
- [ ] 退款按钮 → emit `order.refunded`（接 E13）
- [ ] 分销关系树视图 + ZC 佣金视图（**无提现**）
- [ ] 异常聚集列表（接 ZY-14-09）

## 测试方法
- MCP Puppeteer：订单退款 → 反向 commission 出现

## DoD
- [ ] 三视图 + 退款流程

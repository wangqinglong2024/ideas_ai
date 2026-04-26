# ZY-14-07 · 确认 / 结算 cron + 退款冲销

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 系统
**I want** 每日 cron 把满足条件的 commissions 从 pending 升 settled，并在订单退款时反向冲销
**So that** 推荐人能按时拿到 ZC / 现金奖励，且作弊订单退款后奖励被收回。

## 上下文
- 升级条件：order.paid_at + 7 天 > now (退款窗口)；非作弊
- 冲销：order 退款后调 CommissionEngine.reverse(order)
- ZC 部分：直接进 ledger；现金部分：标记应付，提现接 ZY-17-09

## Acceptance Criteria
- [ ] BullMQ daily cron `commissions:settle`
- [ ] reverse 逻辑：撤回 ZC（写负向 ledger） + 标记应付 reversed
- [ ] 单测：7 日 + 退款 + 冲销 全路径

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run commission.settle
```

## DoD
- [ ] 自动结算正确
- [ ] 冲销不破坏账户

## 依赖
- 上游：ZY-14-06 / ZY-13-06

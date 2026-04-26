# ZY-14-06 · 佣金计算

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 推荐人
**I want** 当我推荐的用户首次充值 / 订阅 / 续费时按规则获得佣金
**So that** 我有持续推荐的动力。

## 上下文
- 规则（dev 默认）：
  - 邀请注册 + 7 日内完成 1 课 → 推荐人 +20 ZC（child +10 ZC）
  - 被邀首次订阅 → 父 20% 现金 + 50 ZC
  - 被邀首次充值 ≥ $10 → 父 10% 现金 + 30 ZC
  - 被邀续费 → 父 10% 现金（一次性，6 月内）
- 所有 commissions 行写 pending；ZY-14-07 cron 升 settled
- 与订单 status=paid 联动

## Acceptance Criteria
- [ ] CommissionEngine.onOrderPaid(order) hook
- [ ] CommissionEngine.onUserActive(user) hook（首课）
- [ ] 单测：四规则全覆盖
- [ ] 重复事件幂等（order_id 唯一索引）

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run commission.calc
```

## DoD
- [ ] 4 规则准确
- [ ] 幂等

## 依赖
- 上游：ZY-14-05 / ZY-13-04 / ZY-12

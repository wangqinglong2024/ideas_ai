# Story 14 索引 · 分销系统（Referral）

> Epic：[E14 Referral](../../epics/14-referral.md) · Sprint：[S14](../../sprint/14-referral.md) · 阶段：M5-M6 · 周期：W30-W33

## Story 列表

| Story | 标题 | 状态 |
|---|---|---|
| [14-1](./14-1-referral-tables-rls.md) | 三表 + RLS（无 withdraw 表） | ready-for-dev |
| [14-2](./14-2-invitation-code-generation.md) | 注册时邀请码生成 | ready-for-dev |
| [14-3](./14-3-share-link-asset-center.md) | 分享链接 + 海报 | ready-for-dev |
| [14-4](./14-4-referral-landing-page.md) | /r/:code 落地页 | ready-for-dev |
| [14-5](./14-5-parent-binding-anti-cheat.md) | 上级绑定 + 反作弊拒绑 | ready-for-dev |
| [14-6](./14-6-commission-calc-webhook.md) | 佣金计算（订单 webhook） | ready-for-dev |
| [14-7](./14-7-fourteen-day-confirmation-cron.md) | 14d cron + 自动 ZC 入账 | ready-for-dev |
| [14-8](./14-8-refund-commission-reverse.md) | 退款 → 佣金反向 | ready-for-dev |
| [14-9](./14-9-referral-dashboard.md) | 仪表板 /me/referral（ZC） | ready-for-dev |
| [14-10](./14-10-anti-cheat-monitoring.md) | 反作弊监控 + 后台审计 | ready-for-dev |
| [14-11](./14-11-notifications-leaderboard.md) | 通知 + 月度排行榜 | ready-for-dev |

## 关键约束（全 Sprint 通用）
- referral_commissions.amount_coins（INT，单位 ZC，**不存在 USD 字段**）
- **不创建** referral_withdrawals / referral_balances 表
- 任何位置不显示纯 code 字符串；任何 API 不返回单独 code 字段
- 旧 withdraw / regenerate / code 端点强制 404
- 单户年 ≤ 200,000 ZC（不计入 EC 50k 月发行上限）

## DoD
- 邀请 → 注册 → 付费 → 14d confirm → ZC 入账 全链路
- 退款链路 → 反向扣减不丢
- 仪表板单位 ZC 准确
- 0 处暴露纯 code；安全审计通过

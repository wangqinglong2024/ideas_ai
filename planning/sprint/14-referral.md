# Sprint S14 · 分销系统（Referral）

> Epic：[E14](../epics/14-referral.md) · 阶段：M5-M6 · 周期：W30-W33 · 优先级：P0
> Story 数：11 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-14)

## Sprint 目标
邀请 / 二级分销 / 佣金（以 ZC 发放，**永不支持现金提现**）/ 反作弊。佣金 confirm 后自动入账知语币。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 14-1-referral-tables-rls | 三表 + RLS（无 withdraw 表） | M | S01 | W30 |
| 2 | 14-2-invitation-code-generation | 注册时邀请码生成 | S | 14-1,S03 | W30 |
| 3 | 14-3-share-link-asset-center | 分享链接 + 海报 | M | 14-2 | W30 |
| 4 | 14-4-referral-landing-page | /r/:code 落地页 | M | 14-2 | W31 |
| 5 | 14-5-parent-binding-anti-cheat | 上级绑定 + 反作弊拒绑 | L | 14-4,S18 | W31 |
| 6 | 14-6-commission-calc-webhook | 佣金计算（订单 webhook） | L | 14-5,S13 | W31 |
| 7 | 14-7-fourteen-day-confirmation-cron | 14d cron + 自动 ZC 入账 | M | 14-6,S12 | W32 |
| 8 | 14-8-refund-commission-reverse | 退款 → 佣金反向 | M | 14-7,S13 | W32 |
| 9 | 14-9-referral-dashboard | 仪表板 /me/referral（ZC） | L | 14-7 | W32 |
| 10 | 14-10-anti-cheat-monitoring | 反作弊监控 + 后台审计 | L | 14-5,S17 | W33 |
| 11 | 14-11-notifications-leaderboard | 通知 + 月度排行榜 | M | 14-7 | W33 |

## 关键约束
- referral_commissions.amount_coins（INT，单位 ZC，**不存在 USD 字段**）
- **不创建** referral_withdrawals / referral_balances 表
- 任何位置不显示纯 code 字符串；任何 API 不返回单独 code 字段
- 旧 withdraw / regenerate / code 端点强制 404

## 风险
- 反作弊误伤 → 申诉流程 + 人工复核
- 佣金 ZC 通胀 → 单户年 ≤ 200,000 ZC 限制；不计入 EC 50k 月发行上限

## DoD
- [ ] 邀请 → 注册 → 付费 → 14d confirm → ZC 入账 全链路
- [ ] 退款链路 → 反向扣减不丢
- [ ] 仪表板单位 ZC 准确
- [ ] 0 处暴露纯 code；安全审计通过
- [ ] retrospective 完成

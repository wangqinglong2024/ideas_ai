# Sprint S12 · 知语币与商城（Economy）

> Epic：[E12](../epics/12-economy.md) · 阶段：M5 · 周期：W27-W29 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-12)

## Sprint 目标
知语币的获得 / 消耗 / 充值 / 商城；与学习 / 游戏 / 分销联动；反作弊。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 12-1-coins-balances-ledger-tables | 余额 + 流水表 | M | S01 | W27 |
| 2 | 12-2-earning-rules-engine | 获得规则引擎 | L | 12-1,S07 | W27 |
| 3 | 12-3-spend-api-idempotency | 消耗 API + 幂等 | M | 12-1 | W27 |
| 4 | 12-5-shop-items-api | 商城商品 API | M | 12-1 | W28 |
| 5 | 12-4-recharge-flow | 充值流程（接 S13） | M | 12-1,S13 | W28 |
| 6 | 12-6-shop-page | 商城页 | L | 12-3,12-5 | W28 |
| 7 | 12-7-ledger-personal-page | 流水页 | M | 12-1 | W28 |
| 8 | 12-8-seven-day-checkin | 签到 7 天 | M | 12-2 | W29 |
| 9 | 12-9-admin-rule-config | 后台规则配置 | M | 12-2,S17 | W29 |
| 10 | 12-10-anti-cheat | 反作弊 | M | 12-2 | W29 |

## 风险
- 通胀 / 通缩 → 经济模型 Excel 测算；月度审视
- 反作弊误伤 → 申诉流程 + 人工复核

## DoD
- [ ] 获得 / 消耗全场景跑通
- [ ] 流水准确（balance_after 触发器零差错）
- [ ] 商城可购买
- [ ] 签到 + 反作弊有效
- [ ] retrospective 完成

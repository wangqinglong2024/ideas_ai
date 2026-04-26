# Sprint S12 · 知语币与商城

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/12-economy.md](../epics/12-economy.md) · 阶段：M5 · 周期：W19-W22 · 优先级：P0
> Story 数：8 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
4 周：wallets+ledger 强一致；获取规则；spend API 幂等；充值 fake；商城 5 类商品；商城+流水页；7 日打卡；规则 + 反作弊。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W19 | D1-D2 | ZY-12-01 tables | 200 并发扣费正确 |
| W19 | D2-D4 | ZY-12-02 earning rules | 7 种子 + cap |
| W20 | D5-D7 | ZY-12-03 spend | 幂等 + 5 hooks |
| W20 | D7-D9 | ZY-12-04 recharge fake | fake 闭环 + 5 档 |
| W21 | D10-D12 | ZY-12-05 shop items | 5 类商品 + 库存 |
| W21 | D12-D14 | ZY-12-06 shop+wallet page | 兑换 + 流水 + 库存 |
| W22 | D15-D16 | ZY-12-07 7-day checkin | 7 档 + 时区 |
| W22 | D16-D20 | ZY-12-08 rules+anti-cheat | flagged / 申诉路径 |

## 依赖与并行
- 依赖 S03 / S13
- 与 S11 / S13 / S14 并行

## 退出标准
- 200 并发扣费无超扣
- spend 幂等通过
- flagged 用户暂停 earn

## 风险
- 时区：按 user_settings.tz；默认 Asia/Shanghai
- 库存竞态：行锁

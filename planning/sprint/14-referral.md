# Sprint S14 · 分销系统

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/14-referral.md](../epics/14-referral.md) · 阶段：M5-M6 · 周期：W22-W25 · 优先级：P0
> Story 数：9 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
4 周：referral 三表 + RLS；邀请码生成；分享链接 + 海报；落地页 cookie；绑定父子 + 反作弊；佣金计算 4 规则；确认 cron + 退款冲销；用户 dashboard；反作弊后台。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W22 | D1-D2 | ZY-14-01 tables+RLS | 自我邀请校验 |
| W22 | D2-D3 | ZY-14-02 code gen | 1000 并发不冲突 |
| W22 | D3-D5 | ZY-14-03 share+poster | 4 语 × 3 模板 |
| W23 | D6-D7 | ZY-14-04 landing | cookie 30d + SSR |
| W23 | D7-D9 | ZY-14-05 bind+anti-cheat | 5 校验全过 |
| W24 | D10-D12 | ZY-14-06 commission | 4 规则准确 |
| W24 | D12-D14 | ZY-14-07 cron+reverse | 7 日 + 退款冲销 |
| W25 | D15-D16 | ZY-14-08 dashboard | 实时刷新 |
| W25 | D16-D20 | ZY-14-09 admin | reject/flag/restore |

## 依赖与并行
- 依赖 S12 / S13
- 与 S15 并行

## 退出标准
- 端到端：邀请→注册→订阅→佣金 settle
- 风控可见可处置

## 风险
- 自动结算窗口：7 日确认 vs 退款窗口冲突 → settle 后再退则反向冲销

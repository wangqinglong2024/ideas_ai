# Sprint S07 · 学习引擎

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/07-learning-engine.md](../epics/07-learning-engine.md) · 阶段：M2 · 周期：W9-W12 · 优先级：P0
> Story 数：7 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
4 周：enrollments + lesson_progress；LessonEngine 10-step 状态机；SM-2 简化 SRS；mistake_log + wordbook；user_progression + xp_log + streak / freeze；30Q HSK 自评；6 卡 dashboard 聚合。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W9 | D1-D3 | ZY-07-01 progress tables | RLS + 单测 |
| W9 | D3-D5 | ZY-07-02 LessonEngine | 10-step state machine + zod payload |
| W10 | D6-D8 | ZY-07-03 SRS SM-2 | next_due 计算正确 |
| W10 | D8-D10 | ZY-07-04 mistake+wordbook | 错题加入 SRS |
| W11 | D11-D12 | ZY-07-05 progression | XP 曲线 + streak + freeze + 双倍 XP flag |
| W11 | D13-D14 | ZY-07-06 HSK 30Q | 评级算法 + 推荐 stage |
| W12 | D15-D17 | ZY-07-07 dashboard | 6 卡聚合接口 ≤ 300ms |

## 依赖与并行
- 依赖 S03 / S05
- 与 S06 / S08 并行启动子 story

## 退出标准
- 完整 lesson 全 10 step 可演示
- SRS 队列正确
- streak / freeze 边界测全
- HSK 评级与人工抽样吻合

## 风险
- SM-2 参数调优：保留可配置常量
- streak 时区：按 user_settings.tz

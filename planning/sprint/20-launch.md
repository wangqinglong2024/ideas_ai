# Sprint S20 · 上线与发布

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/20-launch.md](../epics/20-launch.md) · 阶段：M6 · 周期：W26-W28 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周：营销站；跨平台冒烟（5×3×4 矩阵）；增长 pixel 占位；启动活动 3 套；客服知识库 ≥ 20 篇；法务清单 + D-7/D-1/D-Day。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W26 | D1-D3 | ZY-20-01 marketing-site | lighthouse perf ≥ 90 |
| W26 | D3-D5 | ZY-20-02 smoke | 关键路径 100% |
| W27 | D6-D7 | ZY-20-03 pixel stub | PixelAdapter Fake |
| W27 | D7-D10 | ZY-20-04 campaigns | 三活动闭环 |
| W28 | D11-D13 | ZY-20-05 KB | ≥ 20 篇种子 |
| W28 | D13-D15 | ZY-20-06 legal+checklist | 三 checklist 完成 |

## 依赖与并行
- 依赖：所有 epic
- 收尾性质，不能并行其它

## 退出标准
- 三 checklist 全部 ✅
- 冒烟全绿
- 法务文件 4 语就绪

## 风险
- 真实 SMTP / 支付 / 广告 key：上线日清单逐项确认
- 上线日告警值班：on-call 排班表

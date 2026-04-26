# Sprint S08 · 课程模块

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/08-courses.md](../epics/08-courses.md) · 阶段：M3 · 周期：W12-W14 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周：courses+lessons schema 含 steps jsonb + 10 zod payload；RESTful 课程 / 课时 API；3 层路由 list/stage/detail；课时学习页（离线缓存 + 批量回传）；10 step 组件（hanzi-writer 自托管）；完成庆祝 + paywall（订阅 / 单课 / ZC 三路径）。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W12 | D1-D3 | ZY-08-01 schema+steps | 10 zod schema 单测 |
| W12 | D3-D5 | ZY-08-02 API+openapi | zod-to-openapi |
| W13 | D6-D8 | ZY-08-03 routes | progress ring + stage list |
| W13 | D8-D10 | ZY-08-04 lesson page | 离线 + batch 回传 |
| W14 | D11-D13 | ZY-08-05 step components | 10 Step* 组件 + hanzi-writer |
| W14 | D13-D15 | ZY-08-06 celebration+paywall | 三路径解锁闭环 |

## 依赖与并行
- 依赖 S07 / S12 / S13
- 与 S09 / S11 并行

## 退出标准
- 10 step 全闭环示例 lesson
- 离线开始→联网回传成功
- paywall 三路径全测

## 风险
- hanzi-writer 笔顺数据：自托管 + CDN fallback 禁
- 大 lesson payload：分页 step

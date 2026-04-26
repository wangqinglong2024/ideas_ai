# Sprint S16 · 内容工厂（占位 + Adapter）

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/16-content-factory.md](../epics/16-content-factory.md) · 阶段：v1 末 · 周期：W26 · 优先级：P1
> Story 数：3 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
1 周内：gen_jobs 表 + LLMAdapter Fake；admin 占位页；批量导入 CLI / admin 工具，支持 china / course / novels / wordpacks 4 kind。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W26 | D1-D2 | ZY-16-01 schema+adapter | fake 走通 |
| W26 | D2-D3 | ZY-16-02 admin page | fake 上传闭环 |
| W26 | D3-D5 | ZY-16-03 import tool | CLI 4 kind 通 |

## 依赖与并行
- 依赖 S17 / S19

## 退出标准
- fake LLM 闭环
- 4 kind 种子导入幂等

## 风险
- 真实 LLM key：留 Adapter，本期不接

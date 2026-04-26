# Sprint S19 · 可观测与运维

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/19-observability.md](../epics/19-observability.md) · 阶段：M0-M6 横切 · 优先级：P0
> Story 数：8 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
横切 8 项：pino 日志；error_events；events SDK；healthz/metrics；business dashboard；alerts；web vitals RUM；备份恢复。

## 排期
| 周 | Story | 验收 |
|---|---|---|
| W3 | ZY-19-01 pino | docker logs 可读 |
| W4-5 | ZY-19-02 error events | dedupe + admin 列表 |
| W5-6 | ZY-19-03 events SDK | batch 不丢 |
| W6 | ZY-19-04 health+metrics | healthcheck 联通 |
| W18-20 | ZY-19-05 business dashboard | 5 接口 ≤ 500ms |
| W20-21 | ZY-19-06 alerts | 抑制不漏不爆 |
| W22 | ZY-19-07 web vitals | 5 指标全采 |
| W3 起 | ZY-19-08 backup | 备份 + 月度演练 |

## 依赖与并行
- 与所有 sprint 并行
- 上线前 alerts + 备份 + 报表必须就绪

## 退出标准
- 全部 BE 结构化日志
- 业务大盘可看核心指标
- 备份+恢复演练通过

## 风险
- DB 物化视图刷新负载：低峰跑
- 告警渠道 fake：上线前替换为可达通道

# Sprint S15 · 客服 IM 与工单

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/15-customer-service.md](../epics/15-customer-service.md) · 阶段：M6 · 周期：W23-W26 · 优先级：P0
> Story 数：7 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
4 周：cs_conversations / messages / tickets 表；realtime 分发；用户 IM UI；客服工作台；工单 CRUD；FAQ + AI fake；SLA 看板 + 离线兜底。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W23 | D1-D3 | ZY-15-01 tables+RLS | sla_due_at 自动 |
| W23 | D3-D5 | ZY-15-02 realtime | < 500ms 延迟 |
| W24 | D6-D8 | ZY-15-03 user IM UI | 文本+图片+历史 |
| W24 | D8-D10 | ZY-15-04 workbench | claim 唯一 + 模板 |
| W25 | D11-D13 | ZY-15-05 ticket flow | 状态机 + 通知 |
| W25 | D13-D15 | ZY-15-06 FAQ+AI fake | 三轮转人工 |
| W26 | D16-D20 | ZY-15-07 SLA+offline | 5 min 转工单 + 看板 |

## 依赖与并行
- 依赖 S03 / S05 / S17
- 下游：S20

## 退出标准
- 双窗口 IM 实时
- SLA 看板数字准确

## 风险
- LLM key 缺：fake responder
- 实时连接：监控 supabase-realtime 容器

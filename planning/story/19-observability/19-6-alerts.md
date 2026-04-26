# ZY-19-06 · 告警规则 + 通道

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] BullMQ repeatable cron：每分钟扫 `error_events` 增量、`/healthz` 异常、关键队列堆积
- [ ] 阈值与静默窗口写 `alert_rules` 表（admin 可配）
- [ ] 触发 → EmailAdapter（fake → console）+ 站内通知
- [ ] 同 fingerprint 1 小时内只发一次
- [ ] **禁止** PagerDuty / Opsgenie 接入

## 测试方法
- 集成：mock 错误突增 → 告警触发
- 静默窗口：同 fp 不重发

## DoD
- [ ] 告警链路通；不引入 SaaS

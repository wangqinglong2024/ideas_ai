# ZY-13-05 · 续费提醒 + grace period

> Epic：E13 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 到期前 7d / 1d 通过 EmailAdapter（fake → console）+ supabase-realtime 站内通知
- [ ] 失败续费 grace period 3 天（保持权益）
- [ ] grace 后自动 `expired` + 移除 entitlements
- [ ] worker BullMQ repeatable cron 触发

## 测试方法
- 集成：mock 时间到期 → 三阶段状态正确

## DoD
- [ ] grace 链路通；不真实发送邮件

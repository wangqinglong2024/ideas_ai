# ZY-07-03 · SRS 复习引擎（SM-2 简化）

> Epic：E07 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `srs_cards` 表：item_id / item_type / ease / interval / due_at
- [ ] SM-2 简化：质量 0-5 → 调整 ease + interval
- [ ] BullMQ repeatable cron（zhiyu-worker）每日扫 due，生成推荐列表写 `daily_review`
- [ ] 错题自动入队
- [ ] GET `/api/v1/srs/today` 返回今日复习

## 测试方法
- 单元：SM-2 算法
- 集成：cron 触发后 `daily_review` 出现

## DoD
- [ ] 算法正确
- [ ] cron 在 worker 容器跑

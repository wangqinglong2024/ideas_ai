# ZY-15-07 · SLA + 离线兜底

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 客服 leader
**I want** SLA 看板 + 超时告警 + 客服离线时的兜底 (邮件 / 工单)
**So that** 没有用户问题被吞。

## 上下文
- SLA 看板（admin）：实时 / 超时 / 即将超时
- 超时告警：worker 每 5 min 扫，超时未响应 → 飞书/邮件 alert（adapter fake → 写入 alerts 表）
- 离线兜底：用户 IM 发出后 5 分钟无人回 → 自动转工单
- 客服在线状态：心跳 30s，realtime presence

## Acceptance Criteria
- [ ] `/admin/cs/sla` 看板
- [ ] BullMQ cron 超时扫描
- [ ] 5 min 转工单逻辑
- [ ] presence 心跳

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run cs.sla
```

## DoD
- [ ] 看板数字准确
- [ ] 超时告警可见

## 依赖
- 上游：ZY-15-01..06 / ZY-19-06

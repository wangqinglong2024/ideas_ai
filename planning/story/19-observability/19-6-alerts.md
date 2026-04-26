# ZY-19-06 · 告警

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 工程 / 客服
**I want** 告警表 + 多通道分发（站内 / 邮件 / 飞书 / 短信）+ 抑制
**So that** 重要告警必到、不打扰。

## 上下文
- 表 `zhiyu.alerts(id, severity, source, fingerprint, message, ctx, status, created_at, ack_at, resolved_at)`
- 通道：channelAdapter（fake → 仅写表 + 控制台）
- 抑制：同 fingerprint 5 min 内只发一次
- 业务发起：error_events 飙升 / 队列堆积 / 支付失败率 / SLA 超时 / 风控信号

## Acceptance Criteria
- [ ] 表 + 上述场景规则 cron
- [ ] 抑制窗口
- [ ] admin 告警中心页
- [ ] ack / resolve 操作

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run alerts
```

## DoD
- [ ] 抑制不漏不爆

## 依赖
- 上游：ZY-19-02 / 03 / 05

# ZY-19-03 · 业务事件表 + SDK

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 数据分析
**I want** 自建 events 表 + 客户端 / 服务端 SDK
**So that** 替代 PostHog / GTM。

## 上下文
- 表 `zhiyu.events(id, name, user_id, anon_id, props jsonb, ts, session_id)`，分区按月
- SDK：`track(name, props)` + auto pageview + session 续期（30 min idle）
- 上报 batch 5s 或 50 条
- 不接 GTM / GA4 / Mixpanel

## Acceptance Criteria
- [ ] migration + 月分区
- [ ] FE SDK + admin SDK 复用
- [ ] BE batch ingest endpoint + 限流
- [ ] 文档：事件命名规范 (snake_case verb_noun)

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run analytics
```

## DoD
- [ ] batch 入库 + 不丢

## 依赖
- 上游：ZY-19-01

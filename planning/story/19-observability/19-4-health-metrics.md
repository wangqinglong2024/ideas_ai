# ZY-19-04 · 健康检查 + Prometheus metrics

> Epic：E19 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 运维
**I want** /healthz / /readyz + Prometheus /metrics
**So that** docker / nginx / 监控统一查活。

## 上下文
- prom-client：默认 metrics + 自定义（http_request_duration / queue_size / business_events）
- /healthz 浅检查（进程活）；/readyz 深检查（DB / redis / supabase）
- 单独 metrics 端口 9091 (避免暴露主端口)

## Acceptance Criteria
- [ ] 三服务都暴露 healthz/readyz/metrics
- [ ] readyz 失败时容器 unhealthy
- [ ] docker-compose healthcheck 接入

## 测试方法
```bash
curl localhost:8100/healthz; curl localhost:9091/metrics | head
```

## DoD
- [ ] healthcheck 联通
- [ ] metrics 有业务计数

## 依赖
- 上游：ZY-19-01

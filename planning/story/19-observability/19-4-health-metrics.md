# ZY-19-04 · /healthz /readyz /metrics

> Epic：E19 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `GET /healthz` 200 if process alive
- [ ] `GET /readyz` 200 if supabase + redis + 关键 Adapter (fake → ok) 通
- [ ] `GET /metrics` Prometheus 格式（prom-client）：http_requests_total / duration_histogram / inflight / event_loop_lag
- [ ] zhiyu-worker 同步实现

## 测试方法
- curl 三端点
- prometheus scrape 格式校验

## DoD
- [ ] 三端点全在 zhiyu-app-be / zhiyu-admin-be / zhiyu-worker

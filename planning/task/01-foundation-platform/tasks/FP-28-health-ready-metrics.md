# FP-28 · 实现 Health / Ready / Metrics

## 原文引用

- `planning/spec/10-observability.md`：“/health /ready /metrics 三端点。”
- `planning/spec/10-observability.md`：“/metrics 仅 docker 内部网络。”

## 需求落实

- 页面：无。
- 组件：health controller、ready checker、prom-client metrics registry。
- API：`GET /health`、`GET /ready`、`GET /metrics`。
- 数据表：无。
- 状态逻辑：health 表示进程存活；ready 表示关键依赖可用；metrics 限内网。

## 技术假设

- app-be、admin-be 均实现这三个端点。
- 前端容器可以有 nginx health 或静态探活。

## 不明确 / 风险

- 风险：metrics 暴露到公网。
- 处理：compose/nginx 不映射 metrics 或通过中间件限制内网。

## 最终验收清单

- [ ] `/health` 无依赖也能返回进程状态。
- [ ] `/ready` 检查 DB/Redis/迁移状态。
- [ ] `/metrics` 输出 Prometheus 格式且不公网开放。

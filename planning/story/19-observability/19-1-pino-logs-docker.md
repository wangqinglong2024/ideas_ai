# ZY-19-01 · pino 日志 + Docker stdout

> Epic：E19 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** SRE
**I want** 全部 BE 服务用 pino 结构化日志输出到 stdout，docker logs 直接可读
**So that** 不接 SaaS 也能快速排障。

## 上下文
- pino + pino-pretty 仅 dev；prod JSON
- 字段：ts / level / svc / req_id / user_id / route / msg
- HTTP 中间件统一注入 req_id / user_id
- 不接 Sentry / Loggly / Better Stack

## Acceptance Criteria
- [ ] logger 工厂 + 中间件
- [ ] req_id (uuid) 在响应头返回
- [ ] docker logs zhiyu-app-be 可读
- [ ] log level 可 env 控制

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose logs zhiyu-app-be | head
```

## DoD
- [ ] 三服务都有结构化日志

## 依赖
- 上游：ZY-01-04

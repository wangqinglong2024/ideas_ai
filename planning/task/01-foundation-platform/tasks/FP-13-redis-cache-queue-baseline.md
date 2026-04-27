# FP-13 · 接入 Redis 缓存与队列基础能力

## 原文引用

- `planning/spec/02-tech-stack.md`：“缓存/队列 | Redis（既有 docker 容器，复用）| BullMQ + cache。”
- `planning/rules.md` 端口表：“redis | 不暴露 | 内网缓存 / 队列。”

## 需求落实

- 页面：无。
- 组件：Redis client、cache wrapper、BullMQ connection。
- API：无独立外部 API。
- 数据表：无。
- 状态逻辑：Redis 仅内网；API 和 worker 共享连接配置。

## 技术假设

- Redis 7 docker 容器可用。
- `REDIS_URL` 为关键变量，缺失会导致 `/ready` 失败。

## 不明确 / 风险

- 风险：缓存、限流、队列共用 Redis key 冲突。
- 处理：统一 key prefix，如 `zhiyu:<module>:<type>`。

## 最终验收清单

- [ ] Redis 不暴露宿主端口。
- [ ] app-be/admin-be/worker 均可连接 Redis。
- [ ] BullMQ 队列可创建并消费测试 job。

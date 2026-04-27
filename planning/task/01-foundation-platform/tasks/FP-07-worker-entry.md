# FP-07 · 建立 Worker 后台任务入口

## 原文引用

- `planning/spec/01-overview.md`：“Worker | 队列 / cron / 内容任务 | Node worker + BullMQ。”
- `planning/rules.md` 端口表：“worker | 不暴露 | 队列 worker / cron。”

## 需求落实

- 页面：无。
- 组件：BullMQ Worker、Queue registry、cron scheduler、job logger。
- API：无公网 API。
- 数据表：按 job 类型写各模块表，如 seed、factory、backup 状态。
- 状态逻辑：worker 仅内网运行，失败 job 记录重试与错误。

## 技术假设

- 路径建议 `system/apps/worker`。
- 复用 Redis 作为 BullMQ backend。

## 不明确 / 风险

- 风险：worker 与 API 同时执行迁移导致竞争。
- 处理：迁移只在 app-be 启动自检，worker 等 ready 后启动。

## 最终验收清单

- [ ] worker 容器不暴露宿主端口。
- [ ] worker 可连接 Redis。
- [ ] dev 日志能看到 worker ready 状态。

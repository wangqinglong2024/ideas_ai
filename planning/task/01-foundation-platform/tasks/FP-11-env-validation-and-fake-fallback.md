# FP-11 · 环境变量校验与 Fake Fallback

## 原文引用

- `planning/rules.md`：“单一 `.env` 文件位于 `system/docker/.env`。”
- `planning/rules.md`：“缺失非关键 key 时 fallback mock 适配器并打 WARN 日志。”
- `planning/rules.md`：“禁止因缺 key 阻塞容器启动或测试。”

## 需求落实

- 页面：无。
- 组件：env schema、config package、logger warning。
- API：无。
- 数据表：无。
- 状态逻辑：关键基础设施变量缺失才 fail fast；外部服务 key 缺失进入 fake provider。

## 技术假设

- 使用 Zod 校验 env。
- `DATABASE_URL`、`REDIS_URL`、JWT secrets 属关键变量；外部邮件/短信/支付/AI key 属非关键变量。

## 不明确 / 风险

- 风险：把支付/AI key 错误标成关键导致测试中断。
- 处理：在 config schema 中显式分组 critical 和 optional adapters。

## 最终验收清单

- [ ] `system/docker/.env.example` 存在。
- [ ] 缺外部 key 时服务启动并打 WARN。
- [ ] 缺数据库或 Redis 关键变量时 `/ready` 失败。

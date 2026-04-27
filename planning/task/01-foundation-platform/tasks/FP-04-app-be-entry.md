# FP-04 · 建立 App API 后端入口

## 原文引用

- `planning/spec/01-overview.md`：“App API | 学习者业务 API | Express + Supabase SDK。”
- `planning/rules.md` 端口表：“app-be | 8100 | 学习端 API。”

## 需求落实

- 页面：无。
- 组件：Express app、middleware、router、error handler。
- API：`/api/v1/*`、`/health`、`/ready`、`/metrics`。
- 数据表：按模块迁移后访问 Supabase Postgres。
- 状态逻辑：启动时校验环境、数据库连接、Redis 连接，缺非关键外部 key 不退出。

## 技术假设

- 路径建议 `system/apps/app-be`。
- 公开 API 与后台 API 分离部署，避免权限边界混杂。

## 不明确 / 风险

- 风险：模块未实现时路由 404 被误认为服务失败。
- 处理：`/ready` 只检查基础依赖，业务路由按模块任务添加。

## 最终验收清单

- [ ] Docker 启动后 8100 可访问 `/health`。
- [ ] app-be 日志使用 pino JSON。
- [ ] 未配置真实第三方 key 时仍能启动。

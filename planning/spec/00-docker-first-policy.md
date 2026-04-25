# Docker-first 开发约束

日期：2026-04-25

## 硬性规则

- 本项目验收以本地 Docker 为准：`docker compose -f docker-compose.test.yml run --rm --build test`。
- 不使用远端 CI 作为验收条件，不要求 GitHub Actions、PR 模板或 Issue 模板。
- 当前基础设施不得强绑定必须手动注册授权的外部 SaaS。
- 后续业务确实需要 Google 登录、Paddle 支付、短信、邮件、AI API 等外部 key 时，必须先提供 mock/fake/test adapter。
- 缺少密码或 API key 时，测试、构建、本地预览必须继续通过，并在 `/ready` 或日志中暴露缺失项。
- 数据库使用通用 `DATABASE_URL` adapter；E01 不创建真实数据库表，不绑定 Supabase 项目。
- 队列使用通用 `REDIS_URL` adapter；mock 模式不得依赖真实 Redis 可用。

## 旧规划处理

历史研究和未来 story 中如出现必须手动注册授权的外部服务名称，不能直接作为实现依据。开发前必须先改写为 Docker 本地可运行、mock-first、真实 key 可选的方案。

## 质量门禁

- ESLint：阻断代码质量和明显错误。
- Prettier：只格式化当前工程源码与必要工程文档，不格式化 agent 技能资料。
- TypeScript strict：阻断类型错误。
- Vitest：覆盖 adapter mock、API health/ready/events、worker demo。
- Build：确认 app/admin/web/docs/api/worker 均可构建。
- Size check：限制前端产物体积。
- File line check：单文件不超过 800 行。
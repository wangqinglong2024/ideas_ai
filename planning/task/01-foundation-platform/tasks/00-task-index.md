# 01 Foundation Platform · 单任务文件索引

> 本目录只写基础平台、工程骨架、Docker、Supabase、Adapter、观测、测试与发布门禁任务。业务模块功能不得在这里合并实现。

## 任务文件

| 任务 | 文件 | 类型 |
|---|---|---|
| FP-01 | `FP-01-system-code-root.md` | 工程根目录 |
| FP-02 | `FP-02-pnpm-turborepo-typescript.md` | Monorepo |
| FP-03 | `FP-03-app-fe-entry.md` | 应用前端 |
| FP-04 | `FP-04-app-be-entry.md` | 应用 API |
| FP-05 | `FP-05-admin-fe-entry.md` | 后台前端 |
| FP-06 | `FP-06-admin-be-entry.md` | 后台 API |
| FP-07 | `FP-07-worker-entry.md` | Worker |
| FP-08 | `FP-08-docker-compose-ports-networks.md` | Docker 编排 |
| FP-09 | `FP-09-service-dockerfiles.md` | Dockerfile |
| FP-10 | `FP-10-dockerignore-runtime-assets.md` | 镜像边界 |
| FP-11 | `FP-11-env-validation-and-fake-fallback.md` | 环境变量 |
| FP-12 | `FP-12-supabase-self-hosted-baseline.md` | Supabase |
| FP-13 | `FP-13-redis-cache-queue-baseline.md` | Redis |
| FP-14 | `FP-14-express-layered-architecture.md` | 后端分层 |
| FP-15 | `FP-15-rest-api-contract.md` | API 契约 |
| FP-16 | `FP-16-drizzle-migration-baseline.md` | 数据库迁移 |
| FP-17 | `FP-17-shared-packages-baseline.md` | 共享包 |
| FP-18 | `FP-18-email-adapter-fake.md` | Adapter |
| FP-19 | `FP-19-sms-adapter-fake.md` | Adapter |
| FP-20 | `FP-20-push-adapter-fake.md` | Adapter |
| FP-21 | `FP-21-payment-adapter-dummy.md` | Adapter |
| FP-22 | `FP-22-captcha-adapter-always-pass.md` | Adapter |
| FP-23 | `FP-23-llm-adapter-mock.md` | Adapter |
| FP-24 | `FP-24-tts-adapter-mock.md` | Adapter |
| FP-25 | `FP-25-asr-adapter-mock.md` | Adapter |
| FP-26 | `FP-26-workflow-adapter-mock.md` | Adapter |
| FP-27 | `FP-27-pino-json-logging.md` | 可观测性 |
| FP-28 | `FP-28-health-ready-metrics.md` | 可观测性 |
| FP-29 | `FP-29-error-events-telemetry.md` | 可观测性 |
| FP-30 | `FP-30-product-events-tracking.md` | 事件 |
| FP-31 | `FP-31-docker-test-commands.md` | 测试 |
| FP-32 | `FP-32-pg-backup-script.md` | 备份 |
| FP-33 | `FP-33-preflight-self-check.md` | 自检 |
| FP-34 | `FP-34-w0-release-gate-dev-only.md` | 发布门禁 |

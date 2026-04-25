# Epic E01 · 平台基础设施（Platform Foundation）

> 阶段：M0 · 优先级：P0 · 策略：Docker-only、Mock-first、零第三方手动注册

## 摘要

搭建知语 Zhiyu 的 Docker-first monorepo 工程底座。所有开发、测试、构建、预览、API、Worker、环境变量校验、数据库/队列/观测桩均必须通过 Docker 执行；缺少密码或 API Key 时自动降级到 mock adapter，不阻断构建与体验。

## 价值

- 后续 Epic 可以直接在统一 monorepo 中开发。
- 工程验证只依赖 Docker，不污染宿主机环境。
- 外部服务未授权或密钥缺失时，仍能完整运行测试与本地体验。
- 从第一阶段起建立类型、lint、测试、构建、体积和健康检查基线。

## 范围

- pnpm + Turbo monorepo，但命令入口以 Docker Compose 为准。
- 4 个前端/文档入口：`apps/app`、`apps/admin`、`apps/web`、`apps/docs`。
- 后端入口：`apps/api` 与 `apps/worker`。
- 共享包：`ui`、`sdk`、`i18n`、`types`、`config`、`db`、`jobs`、`analytics`、`observability`。
- TypeScript strict、ESLint、Prettier、本地 Docker 验证脚本。
- Dockerfile、`docker-compose.yml`、`docker-compose.test.yml`。
- mock Database/Redis/Analytics/Observability adapters。
- `/health`、`/ready`、配置与事件 API。
- 本地 Docker Compose 使用 mock 环境执行 `pnpm verify`。

## 非范围

- 任何必须手动注册的第三方 SaaS。
- 任何需要手动注册、授权、配置远端账号的外部 SaaS 真实接入。
- 生产域名、云资源创建、第三方仪表板、外部审批流。
- 业务功能、真实数据库 schema、真实支付或真实用户认证。

## 全局约束

- 禁止要求宿主机运行 `pnpm install`、`pnpm build`、`pnpm test` 作为验收条件。
- 必须以 `docker compose -f docker-compose.test.yml run --rm --build test` 作为总验收入口。
- `.env.example` 与 `.env.docker.example` 只放占位值；真实密钥缺失时自动 mock。
- 单文件不得超过 800 行。
- Story 实施按 `bmad-dev-story` 执行；审查按 `bmad-code-review` 执行；复盘按 `bmad-retrospective` 执行。

## Stories

### ZY-01-01 · Docker-first Monorepo

**AC**
- [x] `pnpm-workspace.yaml` 声明 `apps/*` 与 `packages/*`。
- [x] `turbo.json` 定义 `build/dev/lint/typecheck/test`。
- [x] 根 Dockerfile 可构建 workspace、verify、runtime 三类 target。
- [x] README 只给 Docker 命令作为 Quick Start。

### ZY-01-02 · TypeScript Strict 与路径别名

**AC**
- [x] 根 `tsconfig.base.json` 启用 strict、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`。
- [x] 全部 app/package extends base。
- [x] `@zhiyu/*` 路径别名可解析。
- [x] 至少一个 app 跨包引用 `@zhiyu/ui`。

### ZY-01-03 · Lint / Format 基线

**AC**
- [x] ESLint flat config 可覆盖 TS/TSX。
- [x] Prettier 配置固定。
- [x] CONTRIBUTING 说明 Docker 验证与 mock 策略。

### ZY-01-04 · 本地 Docker 验证

**AC**
- [x] `docker-compose.test.yml` 只通过 Docker 运行验证。
- [x] `pnpm verify` 包含 lint、format check、typecheck、test、build、size-check、file-line check。
- [x] 不依赖远端服务、外部 token 或远端缓存。

### ZY-01-05 · Docker Compose 多入口预览

**AC**
- [x] `docker-compose.yml` 启动 app/admin/web/docs/api/worker/redis。
- [x] 前端端口固定为 5173/5174/5175/5176。
- [x] API 端口固定为 3000。
- [x] 不依赖外部 Pages 或域名。

### ZY-01-06 · API Runtime

**AC**
- [x] `apps/api` 可构建为 Node runtime。
- [x] `GET /health` 返回结构化 JSON。
- [x] `GET /ready` 返回 database/queue 检查结果与 mock/real 模式。
- [x] `POST /v1/events` 可用本地 analytics store 接收事件。

### ZY-01-07 · 环境变量与密钥 Mock 策略

**AC**
- [x] `packages/config` 集中读取环境变量。
- [x] 缺失密钥记录到 `missingSecrets`。
- [x] 缺失值使用 mock 默认值，不抛错中断测试。
- [x] `.env.example` 与 `.env.docker.example` 覆盖必要变量。

### ZY-01-08 · 本地 Observability

**AC**
- [x] `packages/observability` 提供本地 JSON logger。
- [x] `captureError` 返回本地 eventId。
- [x] API 错误路径不会依赖第三方 SDK。

### ZY-01-09 · 本地 Analytics

**AC**
- [x] `packages/analytics` 提供本地事件 store。
- [x] API `/v1/events` 接入 store。
- [x] identify/track 不需要外部 Key。

### ZY-01-10 · 数据库 Mock Adapter

**AC**
- [x] `packages/db` 可根据 URL 判断 mock/real 模式。
- [x] `mock://database` 默认可 ready。
- [x] `/ready` 包含 database readiness。

### ZY-01-11 · 队列 Mock Adapter 与 Worker

**AC**
- [x] `packages/jobs` 提供 enqueue/drain/ready。
- [x] `apps/worker` 可处理 demo job。
- [x] Docker Compose 提供 Redis 服务，但 mock 模式不依赖 Redis 可用。

### ZY-01-12 · 文档与模板

**AC**
- [x] `apps/docs` 提供工程文档入口。
- [x] README、CONTRIBUTING、本地验证说明齐备。
- [x] `scripts/check-file-lines.mjs` 强制单文件 ≤ 800 行。

## DoD

- [x] 12 个 stories 均完成并通过审查。
- [x] `docker compose -f docker-compose.test.yml run --rm --build test` 通过。
- [x] `/health` 与 `/ready` 返回结构化 JSON。
- [x] 缺少第三方密钥时测试与体验不中断。
- [x] E01 复盘完成。

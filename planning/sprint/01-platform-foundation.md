# Sprint S01 · 平台基础设施（Platform Foundation）

> Epic：[E01](../epics/01-platform-foundation.md) · 阶段：M0 · 优先级：P0 · 策略：Docker-only
> Story 文件夹：[planning/story/01-platform-foundation/](../story/01-platform-foundation/)

## Sprint 目标

完成 Docker-first monorepo、严格类型、质量门禁、本地 Docker 验证、多入口预览、API/Worker runtime、mock-first 环境/数据/队列/观测/分析能力，为 E02-E20 提供无需宿主机环境、无需第三方手动注册的工程基础。

## 成功度量

- `docker compose -f docker-compose.test.yml run --rm --build test` 全绿。
- `docker compose up --build` 可启动 app/admin/web/docs/api/worker/redis。
- API `/health` 与 `/ready` 返回 200 与结构化 JSON。
- 缺少外部密码或 API Key 时，系统记录缺失项并自动 mock。
- 全仓单文件 ≤ 800 行。

## Story 列表与执行顺序

| 序 | Story Key | 标题 | 依赖 |
|:-:|---|---|---|
| 1 | [1-1-init-monorepo](../story/01-platform-foundation/1-1-init-monorepo.md) | Docker-first Monorepo | - |
| 2 | [1-2-typescript-strict-config](../story/01-platform-foundation/1-2-typescript-strict-config.md) | TypeScript Strict 与路径别名 | 1-1 |
| 3 | [1-3-eslint-prettier](../story/01-platform-foundation/1-3-eslint-prettier.md) | Lint / Format 基线 | 1-1 |
| 4 | [1-4-local-docker-verification](../story/01-platform-foundation/1-4-local-docker-verification.md) | 本地 Docker 验证 | 1-2, 1-3 |
| 5 | [1-5-docker-compose-preview](../story/01-platform-foundation/1-5-docker-compose-preview.md) | Docker Compose 多入口预览 | 1-4 |
| 6 | [1-6-api-worker-runtime](../story/01-platform-foundation/1-6-api-worker-runtime.md) | API Runtime | 1-2, 1-7 |
| 7 | [1-7-mock-first-config](../story/01-platform-foundation/1-7-mock-first-config.md) | 环境变量与密钥 Mock 策略 | 1-2 |
| 8 | [1-10-database-mock-adapter](../story/01-platform-foundation/1-10-database-mock-adapter.md) | 数据库 Mock Adapter | 1-7 |
| 9 | [1-11-queue-mock-adapter-worker](../story/01-platform-foundation/1-11-queue-mock-adapter-worker.md) | 队列 Mock Adapter 与 Worker | 1-7 |
| 10 | [1-8-local-observability](../story/01-platform-foundation/1-8-local-observability.md) | 本地 Observability | 1-6 |
| 11 | [1-9-local-analytics](../story/01-platform-foundation/1-9-local-analytics.md) | 本地 Analytics | 1-6 |
| 12 | [1-12-local-docs](../story/01-platform-foundation/1-12-local-docs.md) | 本地文档入口 | 1-5 |

## 执行计划

### 工程地基

- 1-1：workspace、Turbo、Dockerfile、Compose、README。
- 1-2：strict tsconfig、references、路径别名、跨包导入。
- 1-3：ESLint、Prettier、CONTRIBUTING。

### 自动验证

- 1-4：本地 Docker 验证、`pnpm verify`、体积与行数门禁。
- 1-5：Docker Compose 多入口预览，替代外部 Pages/域名。

### 运行时与 Mock

- 1-7：集中配置与 mock fallback。
- 1-10：数据库 mock adapter。
- 1-11：队列 mock adapter 与 worker。
- 1-6：API `/health`、`/ready`、`/v1/events`。

### 可观测与文档

- 1-8：本地 observability。
- 1-9：本地 analytics。
- 1-12：docs app、README、CONTRIBUTING、单文件行数检查。

## 风险与处理

| 风险 | 处理 |
|---|---|
| Docker 镜像首次构建慢 | 使用单一 workspace 镜像与 Docker layer cache |
| 外部密钥缺失 | `packages/config` 收集 missingSecrets 并启用 mock 默认值 |
| 第三方服务阻塞体验 | E01 不引入必须授权的第三方 SDK |
| 文件持续膨胀 | `scripts/check-file-lines.mjs` 强制 ≤ 800 行 |

## DoD

- [x] 所有 12 story 状态 = done 并通过 code-review。
- [x] Docker 总验证全绿。
- [x] Docker Compose 可启动所有本地服务。
- [x] API 健康检查与 ready 检查通过。
- [x] 缺密钥自动 mock，不中断体验。
- [x] Retrospective 完成。

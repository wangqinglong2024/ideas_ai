# Story 1.1: Docker-first Monorepo

Status: done

## Story

As a 开发者,
I want Docker-first 的 pnpm + Turbo monorepo 骨架,
so that 后续所有 app/package 都能在容器内统一构建、测试与运行。

## Acceptance Criteria

1. `pnpm-workspace.yaml` 声明 `apps/*` 与 `packages/*`。
2. `turbo.json` 定义 `build / dev / lint / typecheck / test`。
3. 根 `package.json` 固定 Node 20、pnpm 9 与统一 scripts。
4. `Dockerfile` 提供 workspace、verify、build、runtime target。
5. `docker-compose.yml` 与 `docker-compose.test.yml` 存在。
6. README Quick Start 只使用 Docker 命令。

## Tasks / Subtasks

- [x] Task 1: 创建 workspace 基线（AC: #1, #3）
  - [x] `pnpm-workspace.yaml`
  - [x] `package.json`
  - [x] `.nvmrc`、`.npmrc`、`.gitignore`
- [x] Task 2: 创建 Turbo pipeline（AC: #2）
  - [x] `turbo.json` 定义 build/dev/lint/typecheck/test
- [x] Task 3: 创建 Docker 入口（AC: #4, #5）
  - [x] `Dockerfile`
  - [x] `docker-compose.yml`
  - [x] `docker-compose.test.yml`
- [x] Task 4: 文档化 Docker Quick Start（AC: #6）
  - [x] `README.md`

## Dev Notes

- 禁止以宿主机 `pnpm install` 作为验收条件。
- 缺少外部密钥时必须继续走 mock。
- 总验证入口：`docker compose -f docker-compose.test.yml run --rm --build test`。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Docker-first monorepo scaffold implemented.

### Completion Notes List

- Created Docker-first pnpm/Turbo workspace baseline.
- Added Docker Compose preview and test entrypoints with mock-friendly defaults.
- Standardized verification command with `--build`.

### File List

- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`
- `docker-compose.test.yml`
- `.nvmrc`
- `.npmrc`
- `.gitignore`
- `README.md`

### Change Log

- 2026-04-25: Implemented and reviewed Docker-first monorepo foundation.

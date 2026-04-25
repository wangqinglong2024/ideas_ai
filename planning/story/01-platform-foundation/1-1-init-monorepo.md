# Story 1.1: 初始化 Monorepo

Status: ready-for-dev

## Story

As a 开发者,
I want 标准化的 pnpm + turborepo monorepo 骨架,
so that 团队可以快速增加新的 app / package 并享受统一构建缓存与依赖管理。

## Acceptance Criteria

1. 仓库根目录使用 pnpm workspace（`pnpm-workspace.yaml`）声明 `apps/*` 与 `packages/*`。
2. 根 `turbo.json` 定义至少 5 个 pipeline：`build / dev / lint / typecheck / test`，含合理 `dependsOn` 与 `outputs`。
3. 创建 4 个 apps 占位（最小可启动）：`apps/app`、`apps/admin`、`apps/web`、`apps/api`。
4. 创建 5 个 packages 占位：`packages/ui`、`packages/sdk`、`packages/i18n`、`packages/types`、`packages/config`。
5. 根级提供基础 `tsconfig.base.json`，所有 app/package extends 它。
6. 在干净环境执行 `pnpm i && pnpm -w build` 全部成功，耗时 < 5 分钟（首次冷构建）。
7. 提交 `.gitignore`、`.npmrc`（含 `node-linker=hoisted` 或合理选择）、`README.md`。
8. Node 版本固定（`.nvmrc` = `20.x`），`packageManager` 字段写明 pnpm 9.x。

## Tasks / Subtasks

- [ ] Task 1: 工程基础（AC: #1, #7, #8）
  - [ ] 创建 `pnpm-workspace.yaml`
  - [ ] 添加 `.nvmrc` (`20`)，根 `package.json` 设置 `packageManager` `engines`
  - [ ] 添加 `.gitignore`（含 `node_modules / .turbo / dist / .env*`）
  - [ ] 添加 `.npmrc`（`auto-install-peers=true` `node-linker=hoisted`）
- [ ] Task 2: turbo 流水线（AC: #2, #6）
  - [ ] 编写 `turbo.json`，定义 build / dev / lint / typecheck / test
  - [ ] `build` 含 `outputs: ["dist/**", ".next/**", "build/**"]`
  - [ ] `dev` 标记 `cache: false, persistent: true`
- [ ] Task 3: tsconfig base（AC: #5）
  - [ ] 根 `tsconfig.base.json`：`target ES2022 / module ESNext / moduleResolution Bundler`
  - [ ] 关闭于 1.2 story 处理（仅 base，不开 strict 在此 story）
  - [ ] 路径别名预留 `@zhiyu/*` 占位（实际生效在 1.2）
- [ ] Task 4: 4 apps 占位（AC: #3）
  - [ ] `apps/app` Vite + React 19 最小骨架（路由占位）
  - [ ] `apps/admin` Vite + React 19 最小骨架
  - [ ] `apps/web` Vite 最小骨架（v1.5 SSG，v1 留空 index.html）
  - [ ] `apps/api` Express + tsx 最小服务（GET `/` 返回 ok）
- [ ] Task 5: 5 packages 占位（AC: #4）
  - [ ] `packages/ui` 导出空 index.ts + tsup 构建
  - [ ] `packages/sdk`、`packages/i18n`、`packages/types`、`packages/config` 同上
- [ ] Task 6: 验收（AC: #6）
  - [ ] `pnpm i && pnpm -w build` 在 GH Codespaces / 本地全绿
  - [ ] 在 README.md 加 `Quick Start` 段

## Dev Notes

### 关键架构约束（必读）
- **包管理器**：pnpm 9.x（统一 lockfile，禁止 npm/yarn）
- **Workspace 协议**：内部依赖统一 `workspace:*`
- **构建器**：Vite for FE apps；tsup for packages；tsx 直跑 API（dev）
- **目录约定**：见 [planning/spec/03-frontend.md § 一](../../spec/03-frontend.md)
- **Node 20 LTS**：与 Render 部署兼容
- **Singapore 区域**：所有云资源选 SG region（与后续 1-10 / 1-6 一致）

### 关联后续 stories
- 1.2 在本 story 完成后立刻接入 strict + 路径别名
- 1.3 在 1.2 后接入 ESLint / Prettier / husky
- 1.4 CI 依赖完整 turbo pipeline
- 1.5 / 1.6 部署依赖 4 apps 可构建

### 测试标准
- 自动化：`pnpm -w build` 必须成功
- 手动：`pnpm --filter=@zhiyu/app dev` 能起 5173；`pnpm --filter=@zhiyu/api dev` 能起 3000

### Project Structure Notes
完全按 [spec/03-frontend.md § 一 Monorepo 结构](../../spec/03-frontend.md) 落地，仅本 story 涉及 4 apps + 5 packages 占位（其它 packages：`games / game-engine / pinyin / analytics` 在后续 epic 引入）。

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-01](../../epics/01-platform-foundation.md)
- [Source: planning/spec/03-frontend.md#一-Monorepo 结构](../../spec/03-frontend.md)
- [Source: planning/spec/02-tech-stack.md](../../spec/02-tech-stack.md)
- [Source: planning/sprint/01-platform-foundation.md#W1](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

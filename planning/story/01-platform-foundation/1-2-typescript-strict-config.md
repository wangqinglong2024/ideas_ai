# Story 1.2: TypeScript Strict 与路径别名

Status: done

## Story

As a 开发者,
I want 全仓 TypeScript strict 与 `@zhiyu/*` 路径别名,
so that 跨包导入稳定且类型错误在容器验证阶段暴露。

## Acceptance Criteria

1. `tsconfig.base.json` 启用 strict、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`noImplicitOverride`。
2. 所有 app/package 的 `tsconfig.json` extends base。
3. `@zhiyu/*` paths 指向 packages 源码入口。
4. packages 使用 composite/declaration 构建。
5. app 演示跨包导入 `@zhiyu/ui`。
6. Docker 验证中的 `pnpm typecheck` 通过。

## Tasks / Subtasks

- [x] Task 1: 根 tsconfig（AC: #1, #3）
  - [x] `tsconfig.base.json`
- [x] Task 2: app/package tsconfig（AC: #2, #4）
  - [x] apps tsconfig
  - [x] packages tsconfig
- [x] Task 3: 跨包导入演示（AC: #5）
  - [x] `apps/app` 使用 `@zhiyu/ui`
- [x] Task 4: Docker typecheck（AC: #6）
  - [x] `pnpm verify` 包含 typecheck

## Dev Notes

- strict 配置不得通过 `ts-ignore` 绕过。
- Vite app 使用本地 alias 指向 package src，Docker build 仍由 package build 产物兜底。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Strict TS baseline implemented.

### Completion Notes List

- Enabled strict TypeScript options and project references.
- Added workspace alias resolution for app builds and Vitest package tests.
- Serialized Turbo typecheck/build execution for stable Docker validation.

### File List

- `tsconfig.base.json`
- `vitest.config.ts`
- `apps/*/tsconfig.json`
- `packages/*/tsconfig.json`
- `apps/app/src/main.tsx`
- `packages/ui/src/index.ts`

### Change Log

- 2026-04-25: Implemented strict TS baseline and alias-backed tests.

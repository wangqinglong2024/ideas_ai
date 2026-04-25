# Story 1.3: ESLint + Prettier + Commitlint

Status: ready-for-dev

## Story

As a 开发者,
I want 仓库统一的代码风格与 git hook 强制约束,
so that PR 进入审查前已经满足风格 / commit 规范，减少低价值评审噪音。

## Acceptance Criteria

1. `packages/config` 提供 `eslint-preset.cjs`、`prettier-preset.cjs`、`tsconfig.base.json` 三件共享配置。
2. 根 `.eslintrc.cjs` 引用 preset；apps 与 packages 通过 extend 该 preset 工作。
3. ESLint 规则集包含：`@typescript-eslint`、`react`、`react-hooks`、`jsx-a11y`、`import`、`unicorn`（精选规则）。
4. Prettier 配置：`semi: true / singleQuote: true / trailingComma: all / printWidth: 100`，与 ESLint 通过 `eslint-config-prettier` 解冲突。
5. Husky + lint-staged 配置 pre-commit：对暂存的 `*.{ts,tsx,js,cjs,mjs,md,json,yaml}` 跑 prettier + 对 `*.{ts,tsx}` 跑 eslint --fix。
6. Commitlint 配置 `@commitlint/config-conventional`，commit-msg hook 阻断不符合 Conventional Commits 的提交。
7. 根命令 `pnpm lint` `pnpm format` `pnpm format:check` 全部就绪。
8. 在 `_bmad-output/repo` 或 `docs/contributing.md` 中记录 commit 类型集合（feat/fix/chore/docs/refactor/test/perf/build/ci）。
9. 演示：故意提交一条 `wip xxx` 被拒；提交 `feat(ui): add Button` 通过。

## Tasks / Subtasks

- [ ] Task 1: 共享配置包（AC: #1）
  - [ ] `packages/config/eslint-preset.cjs`
  - [ ] `packages/config/prettier-preset.cjs`
  - [ ] `packages/config/index.ts` 导出 preset 路径
- [ ] Task 2: 根 lint 配置（AC: #2, #3, #4, #7）
  - [ ] 根 `.eslintrc.cjs` extends preset
  - [ ] 根 `.prettierrc.cjs` 引 preset
  - [ ] 根 `package.json` scripts 添加 `lint` `format` `format:check`
- [ ] Task 3: Husky + lint-staged（AC: #5, #6, #9）
  - [ ] `pnpm dlx husky init`
  - [ ] `.husky/pre-commit` 调 `pnpm exec lint-staged`
  - [ ] `.husky/commit-msg` 调 `pnpm exec commitlint --edit $1`
  - [ ] 根 `package.json` 加 `lint-staged` 字段
  - [ ] `commitlint.config.cjs`
- [ ] Task 4: 文档（AC: #8）
  - [ ] `CONTRIBUTING.md` 写明 commit 规范、PR 流程、本地命令
- [ ] Task 5: 验收演示（AC: #9）
  - [ ] 录一段 README 演示：错误 commit 被拒，正确 commit 通过

## Dev Notes

### 关键决策
- 选 ESLint 8.x（避开 9.x flat config 与生态滞后）—— 待 v1.5 切 flat
- Prettier 与 ESLint 冲突仅靠 `eslint-config-prettier` 解，禁止用 `eslint-plugin-prettier`（性能）
- husky 9.x 简化 init，新位置 `.husky/`
- commit scope 暂不强制；body / footer 不限制

### Project Structure Notes
共享配置全部落 `packages/config`，与 spec/03-frontend.md § 一描述一致。

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-03](../../epics/01-platform-foundation.md)
- [Source: planning/sprint/01-platform-foundation.md#W1](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

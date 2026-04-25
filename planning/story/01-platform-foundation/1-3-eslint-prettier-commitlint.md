# Story 1.3: Lint / Format / Commit 基线

Status: done

## Story

As a 开发者,
I want 统一 lint、format 与 commit 规范,
so that Docker 验证能在代码进入评审前拦截低价值问题。

## Acceptance Criteria

1. 根 `eslint.config.mjs` 可检查 TS/TSX。
2. 根 `.prettierrc.json` 固定格式规则。
3. `commitlint.config.cjs` 使用 Conventional Commits。
4. `CONTRIBUTING.md` 说明 Docker 验证与 commit 类型。
5. `pnpm verify` 包含 lint 与 format check。

## Tasks / Subtasks

- [x] Task 1: ESLint（AC: #1, #5）
  - [x] `eslint.config.mjs`
- [x] Task 2: Prettier（AC: #2, #5）
  - [x] `.prettierrc.json`
  - [x] `.prettierignore`
- [x] Task 3: Commit 规范（AC: #3, #4）
  - [x] `commitlint.config.cjs`
  - [x] `scripts/check-commit.mjs`
  - [x] `CONTRIBUTING.md`

## Dev Notes

- 不要求用户安装 hook 或在宿主机执行命令。
- commit 示例通过脚本与文档表达，不依赖手工演示。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Quality baseline implemented.

### Completion Notes List

- Added ESLint flat config, Prettier config, commitlint config and commit example script.
- Fixed Node/browser globals so Docker lint runs cleanly.
- Documented Docker-only contributor workflow.

### File List

- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `commitlint.config.cjs`
- `scripts/check-commit.mjs`
- `CONTRIBUTING.md`

### Change Log

- 2026-04-25: Implemented lint, format and commit quality baseline.

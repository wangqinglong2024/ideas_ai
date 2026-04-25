# Story 1.3: Lint / Format 基线

Status: done

## Story

As a 开发者,
I want 统一 lint 与 format 规范,
so that Docker 验证能在代码进入评审前拦截低价值问题。

## Acceptance Criteria

1. 根 `eslint.config.mjs` 可检查 TS/TSX。
2. 根 `.prettierrc.json` 固定格式规则。
3. `CONTRIBUTING.md` 说明 Docker 验证与 mock 策略。
4. `pnpm verify` 包含 lint 与 format check。

## Tasks / Subtasks

- [x] Task 1: ESLint（AC: #1, #4）
  - [x] `eslint.config.mjs`
- [x] Task 2: Prettier（AC: #2, #4）
  - [x] `.prettierrc.json`
  - [x] `.prettierignore`
- [x] Task 3: 本地协作说明（AC: #3）
  - [x] `CONTRIBUTING.md`

## Dev Notes

- 不要求用户安装 hook 或在宿主机执行命令。
- 不增加与运行、构建、测试无关的提交钩子或远端流程。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Quality baseline implemented.

### Completion Notes List

- Added ESLint flat config and Prettier config.
- Fixed Node/browser globals so Docker lint runs cleanly.
- Documented Docker-only contributor workflow.

### File List

- `eslint.config.mjs`
- `.prettierrc.json`
- `.prettierignore`
- `CONTRIBUTING.md`

### Change Log

- 2026-04-25: Implemented lint and format quality baseline.

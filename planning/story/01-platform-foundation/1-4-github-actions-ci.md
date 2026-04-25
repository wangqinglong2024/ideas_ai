# Story 1.4: Docker CI

Status: done

## Story

As a 开发者,
I want CI 通过 Docker 执行完整验证,
so that 远端验证与本地容器验证使用同一入口。

## Acceptance Criteria

1. `.github/workflows/ci.yml` 在 PR、main push、workflow_dispatch 触发。
2. CI 只运行 Docker Compose 测试入口。
3. `pnpm verify` 包含 lint、format check、typecheck、test、build、size-check、file-line check。
4. PR 模板要求填写 Docker 验证结果。
5. 不依赖远端缓存、外部 token 或第三方 CI 插件。

## Tasks / Subtasks

- [x] Task 1: Docker CI workflow（AC: #1, #2, #5）
  - [x] `.github/workflows/ci.yml`
- [x] Task 2: 验证脚本聚合（AC: #3）
  - [x] `package.json` `verify`
  - [x] `scripts/size-check.mjs`
  - [x] `scripts/check-file-lines.mjs`
- [x] Task 3: PR 模板（AC: #4）
  - [x] `.github/pull_request_template.md`

## Dev Notes

- CI 不需要任何外部 SaaS secret。
- 缺密钥场景应被测试覆盖为 mock fallback。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Docker CI implemented.

### Completion Notes List

- Added Docker-only CI workflow with no external secrets or plugins.
- Aggregated `pnpm verify` across lint, format, typecheck, tests, build, size and line checks.
- Updated PR verification checkbox to use the rebuild command.

### File List

- `.github/workflows/ci.yml`
- `.github/pull_request_template.md`
- `package.json`
- `scripts/size-check.mjs`
- `scripts/check-file-lines.mjs`

### Change Log

- 2026-04-25: Implemented Docker CI and verification aggregation.

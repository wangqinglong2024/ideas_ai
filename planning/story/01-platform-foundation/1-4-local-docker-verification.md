# Story 1.4: 本地 Docker 验证

Status: done

## Story

As a 开发者,
I want 本地 Docker 执行完整验证,
so that 不依赖远端服务也能确认底层质量。

## Acceptance Criteria

1. `docker-compose.test.yml` 定义本地 test 服务。
2. test 服务只运行 `pnpm verify`。
3. `pnpm verify` 包含 lint、format check、typecheck、test、build、size-check、file-line check。
4. Docker 验证命令固定为 `docker compose -f docker-compose.test.yml run --rm --build test`。
5. 不依赖远端缓存、外部 token 或第三方自动化插件。

## Tasks / Subtasks

- [x] Task 1: Docker test service（AC: #1, #2, #5）
  - [x] `docker-compose.test.yml`
- [x] Task 2: 验证脚本聚合（AC: #3）
  - [x] `package.json` `verify`
  - [x] `scripts/size-check.mjs`
  - [x] `scripts/check-file-lines.mjs`
- [x] Task 3: 本地验证命令（AC: #4）
  - [x] `package.json` `docker:test`

## Dev Notes

- 本地 Docker 验证不需要任何外部 SaaS secret。
- 缺密钥场景应被测试覆盖为 mock fallback。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Local Docker verification implemented.

### Completion Notes List

- Added Docker-only local verification with no external secrets or plugins.
- Aggregated `pnpm verify` across lint, format, typecheck, tests, build, size and line checks.
- Standardized `docker:test` to use the rebuild command.

### File List

- `docker-compose.test.yml`
- `package.json`
- `scripts/size-check.mjs`
- `scripts/check-file-lines.mjs`

### Change Log

- 2026-04-25: Implemented local Docker verification and verification aggregation.

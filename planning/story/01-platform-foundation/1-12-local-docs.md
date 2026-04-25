# Story 1.12: 本地文档入口

Status: done

## Story

As a 开发者,
I want Docker-first 工程文档入口,
so that 后续开发者能清楚知道如何验证、提交与报告问题。

## Acceptance Criteria

1. `apps/docs` 提供 Vite 文档入口。
2. README 包含 Docker Quick Start 与本地 URL。
3. CONTRIBUTING 说明 Docker 验证、commit 类型与密钥 mock 策略。
4. 文档不依赖 GitHub PR、Issue 或 Actions。
5. `scripts/check-file-lines.mjs` 强制单文件 ≤ 800 行。

## Tasks / Subtasks

- [x] Task 1: Docs app（AC: #1）
  - [x] `apps/docs`
- [x] Task 2: 协作文档（AC: #2, #3）
  - [x] `README.md`
  - [x] `CONTRIBUTING.md`
- [x] Task 3: 本地质量脚本（AC: #4, #5）
  - [x] 不创建 GitHub PR/Issue/Actions 模板
  - [x] File line check

## Dev Notes

- 不创建额外变更说明文档；只维护必要工程入口与模板。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Docs and templates implemented.

### Completion Notes List

- Replaced Storybook scope with Docker-first docs app and local documentation.
- Added README/CONTRIBUTING guidance for Docker validation and mock secrets.
- Added file line check and removed GitHub automation/templates from E01 scope.

### File List

- `apps/docs/*`
- `README.md`
- `CONTRIBUTING.md`
- `scripts/check-file-lines.mjs`
- `Dockerfile`
- `.dockerignore`

### Change Log

- 2026-04-25: Implemented docs app and repository line guard.

# Story 1.5: Docker Compose 多入口预览

Status: done

## Story

As a 开发者,
I want 使用 Docker Compose 启动全部本地入口,
so that 无需外部 Pages、域名或授权即可预览 app/admin/web/docs/api/worker。

## Acceptance Criteria

1. `docker-compose.yml` 定义 app/admin/web/docs/api/worker/redis。
2. app/admin/web/docs 分别监听 5173/5174/5175/5176。
3. API 监听 3000。
4. Worker 能通过容器命令运行 demo job。
5. README 列出本地 URL。
6. 不创建外部静态站或自定义域名。

## Tasks / Subtasks

- [x] Task 1: Compose 服务（AC: #1, #2, #3, #4）
  - [x] `docker-compose.yml`
- [x] Task 2: 前端入口（AC: #2）
  - [x] `apps/app`
  - [x] `apps/admin`
  - [x] `apps/web`
  - [x] `apps/docs`
- [x] Task 3: README URL（AC: #5, #6）
  - [x] Docker URL 表

## Dev Notes

- 文件名保留历史 story key，但故事内容已替换为 Docker Compose 预览。
- 不引入外部部署平台。

## Dev Agent Record

### Agent Model Used

GitHub Copilot

### Debug Log References

- Multi-entry Docker preview implemented.

### Completion Notes List

- Replaced external Pages deployment scope with local Docker Compose preview.
- Added app/admin/web/docs Vite entrypoints and fixed ports.
- Documented local URLs in README.

### File List

- `docker-compose.yml`
- `apps/app/*`
- `apps/admin/*`
- `apps/web/*`
- `apps/docs/*`
- `README.md`

### Change Log

- 2026-04-25: Implemented Docker Compose multi-entry preview.

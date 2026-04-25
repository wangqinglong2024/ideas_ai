# Story 1.5: Cloudflare Pages 部署 4 站

Status: ready-for-dev

## Story

As a 开发者,
I want app / admin / web / storybook 4 个静态站点都部署到 Cloudflare Pages 并支持 PR preview,
so that 团队可以在每次 PR 上对 4 个面向用户/内部的入口做实时预览和评审。

## Acceptance Criteria

1. Cloudflare Pages 创建 4 个项目：`zhiyu-app` `zhiyu-admin` `zhiyu-web` `zhiyu-storybook`，分别对应 `apps/app` `apps/admin` `apps/web` `apps/ui (storybook)`。
2. 每个项目通过 GitHub 集成（或 wrangler）配置：build command + output dir 正确（Vite → `dist`，Storybook → `storybook-static`）。
3. PR 触发 preview deployment，URL 自动评论到 PR 中（每站一条评论或 1 条聚合）。
4. 推送 `main` 分支自动部署到 staging 域名（`*-staging.zhiyu.io`）。
5. 推送 `v*` tag 触发 production 部署，并在 GitHub Environment 上要求 1 名 reviewer 手动审批。
6. 4 个生产域名解析到 prod deployment：
   - `app.zhiyu.io` → zhiyu-app prod
   - `admin.zhiyu.io` → zhiyu-admin prod
   - `zhiyu.io` 与 `www.zhiyu.io` → zhiyu-web prod
   - `storybook.zhiyu.io` → zhiyu-storybook prod
7. HTTPS 强制 + HSTS（Cloudflare 控制台）；HTTP/2 + Brotli 启用。
8. 4 个项目均设置安全 HTTP headers（CSP 占位 + X-Frame-Options DENY 等，详细 CSP 在 18-3 完成）。
9. SPA fallback：`/_redirects` 或 `_routes.json` 处理 `/* → /index.html`（admin / app 必需）。
10. 部署日志可查；部署事件发到 Slack `#deploys`（本 story 接 webhook 占位，正式频道在 19-10）。

## Tasks / Subtasks

- [ ] Task 1: 4 个 Pages 项目（AC: #1, #2）
  - [ ] 用 wrangler 或 dashboard 创建
  - [ ] build command 文档化在 `docs/deployment.md`
- [ ] Task 2: PR Preview 评论（AC: #3）
  - [ ] CF 内置评论 + 增强：自定义 GH Action 聚合 4 个 URL
- [ ] Task 3: 环境与审批（AC: #4, #5）
  - [ ] 创建 GitHub Environments：`staging`、`production`
  - [ ] `production` 启用 required reviewers
  - [ ] tag 流水线 `.github/workflows/release.yml` 调 wrangler
- [ ] Task 4: 域名（AC: #6, #7）
  - [ ] CF DNS + Custom domains 配置
  - [ ] HSTS preload 暂不开（防回滚），仅启用 HSTS 1y
- [ ] Task 5: SPA fallback + headers（AC: #8, #9）
  - [ ] `_redirects` `_headers` 文件
- [ ] Task 6: 部署事件 webhook（AC: #10）
  - [ ] CF Workers Hook → Slack incoming webhook（占位）

## Dev Notes

### 关键决策
- **静态站全部 Cloudflare Pages**（API/Worker 在 1-6 走 Render）
- Storybook 部署使用 `apps/ui/storybook-static` 还是 `packages/ui` 内 build？—— 决策放在 `apps/ui-storybook`（轻 wrapper）或直接 `packages/ui`。本 story 选择放 `packages/ui` 输出 `storybook-static`，由 CF Pages 拉取该目录。
- Preview 域：`<sha>.zhiyu-app.pages.dev`（CF 默认）+ 自定义 `pr-<num>.app-staging.zhiyu.io`（v1.5）

### Project Structure Notes
与 spec/08-deployment.md § 4（Cloudflare Pages 4 站）一致。

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-05](../../epics/01-platform-foundation.md)
- [Source: planning/spec/08-deployment.md#§-4](../../spec/08-deployment.md)
- [Source: planning/sprint/01-platform-foundation.md#W2](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

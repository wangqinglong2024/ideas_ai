# Story 5.3: TanStack Router 配置

Status: ready-for-dev

## Story

作为 **前端开发者**，
我希望 **基于 TanStack Router 文件路由建立类型安全、嵌套布局清晰的路由体系**，
以便 **后续页面可以快速接入并享受类型推导与路由守卫**。

## Acceptance Criteria

1. 引入 `@tanstack/react-router` 与 `@tanstack/router-vite-plugin`，启用文件路由（`apps/app/src/routes/`）。
2. 路由树覆盖：`/`（发现）/ `/learn`（学）/ `/games`（玩）/ `/coins`（知语币）/ `/me`（我）+ `/auth/*` + `/discover/article/$id` + `/courses/*`。
3. 嵌套布局：根布局 → AppShell（含底部导航 + 顶栏）→ 子页面；`/auth/*` 不走 AppShell。
4. 受保护路由：`/me`、`/learn` 等使用 `beforeLoad` 守卫，未登录跳 `/auth/login?redirect=...`。
5. 滚动恢复：开启 `scrollRestoration`，前进保留位置，新进入回到顶部。
6. 类型生成：`routeTree.gen.ts` 由 vite plugin 自动生成；TS 类型可推导 `Link` `to` 与 `params`。
7. 404 兜底：`__root.tsx` 配置 `notFoundComponent`，提供「返回首页」入口。
8. 错误边界：每个布局层提供 `errorComponent`，展示错误 + 「重试」按钮。

## Tasks / Subtasks

- [ ] **依赖与构建集成**（AC: 1,6）
  - [ ] 安装 `@tanstack/react-router` `@tanstack/router-vite-plugin` `@tanstack/router-devtools`
  - [ ] vite.config.ts 配置 routerPlugin

- [ ] **建立路由文件结构**（AC: 2,3,7）
  - [ ] `routes/__root.tsx`（根布局 + devtools dev only）
  - [ ] `routes/_app.tsx`（AppShell 含底部导航 + 顶栏）
  - [ ] `routes/_app/index.tsx`（发现页占位）
  - [ ] `routes/_app/learn.tsx` `/games.tsx` `/coins.tsx` `/me.tsx`
  - [ ] `routes/auth/login.tsx` `routes/auth/register.tsx`
  - [ ] `routes/_app/discover/article/$id.tsx`
  - [ ] `routes/_app/courses/index.tsx` `routes/_app/courses/$id.tsx`

- [ ] **守卫与滚动**（AC: 4,5）
  - [ ] 实现 `requireAuth` beforeLoad 工具
  - [ ] 在受保护路由集成；未登录 throw `redirect`
  - [ ] router 配置 `scrollRestoration: true`

- [ ] **错误与 404**（AC: 7,8）
  - [ ] 全局 `defaultErrorComponent`
  - [ ] root `notFoundComponent`

- [ ] **DevTools 与类型校验**（AC: 6）
  - [ ] 仅 dev 加载 `<TanStackRouterDevtools />`
  - [ ] `tsc --noEmit` 通过

## Dev Notes

### 关键约束
- 文件路由 `routeTree.gen.ts` 必须加入 `.gitignore` 或受 lint 忽略，由构建生成。
- 守卫的 redirect 必须保留 `?redirect=` 参数以便登录后跳回。
- 嵌套布局命名约定 `_app.tsx`（前缀下划线表示 layout）。

### 关联后续 stories
- 5-4（Query）需在 router context 注入 QueryClient
- 5-5 / 5-6 在 `_app.tsx` 中渲染
- 5-8（发现页骨架）落在 `_app/index.tsx`
- 后续业务路由在此基础上扩展

### Project Structure Notes
- `apps/app/src/routes/`
- `apps/app/src/router.tsx`（createRouter + 类型注入）
- `apps/app/src/main.tsx`（RouterProvider）

### References
- `planning/epics/05-app-shell.md` ZY-05-03
- `planning/ux/06-navigation-routing.md`
- TanStack Router docs

### 测试标准
- 单元：requireAuth 守卫
- E2E：未登录访问 `/me` 跳登录；登录后 redirect 回原地
- E2E：404 路径展示 notFound 页

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 17.4: 后台 App Shell（侧栏 + 顶栏 + 主题）

Status: ready-for-dev

## Story

作为 **后台管理员**，
我希望 **拥有统一的后台外壳（侧栏导航 + 顶栏 + 主题切换）**，
以便 **所有后台模块在一致的玻璃态 UI 中工作，桌面端体验流畅**。

## Acceptance Criteria

1. 应用 `apps/admin`：Vite + React 19 + TanStack Router + Tailwind v4，复用 E02 design system tokens。
2. 布局：左侧栏（折叠式，最小 64px / 展开 240px）+ 顶栏（48px，含搜索 / 通知 / 用户菜单 / 主题切换） + 内容区。
3. 侧栏菜单按 RBAC 动态渲染：仅显示当前 admin 拥有 `read` 权限的模块（17-3 提供 hook）。
4. 顶栏全局搜索（⌘K）：搜索用户 / 订单 / 内容（联调相应模块的 search API，本 story 仅放置 placeholder + 框架）。
5. 通知中心：未读数 badge；点击展开抽屉显示系统通知 + factory SLA 警告 + 错误告警；标记已读 / 全部已读。
6. 主题：light / dark / system；切换写 localStorage `admin.theme`；玻璃态背景 token（与 C 端不同的"专业版"调色板）。
7. **响应式**：仅支持桌面（min-width 1280px），低于阈值显示提示页"请使用桌面访问"。
8. **国际化**：界面默认 `zh`，env 可切；本 story 仅完成 i18n 框架接入，文案少量。
9. **错误边界**：路由级 ErrorBoundary，500 / 403 / 404 友好页。
10. **可访问性**：键盘焦点、aria-labels；axe 自动检测 0 critical。
11. e2e 测试：登录后进入 shell；侧栏权限过滤；主题切换持久化。

## Tasks / Subtasks

- [ ] **应用初始化**（AC: 1）
  - [ ] `apps/admin/` Vite + Router 骨架
  - [ ] tailwind v4 + tokens
- [ ] **布局组件**（AC: 2, 7, 9, 10）
  - [ ] `<AppShell>` / `<Sidebar>` / `<Topbar>`
- [ ] **RBAC 菜单**（AC: 3）
- [ ] **全局搜索 ⌘K**（AC: 4）
  - [ ] cmdk 库 + placeholder
- [ ] **通知中心**（AC: 5）
- [ ] **主题切换**（AC: 6）
- [ ] **i18n 框架**（AC: 8）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- 玻璃态在 admin 风格更克制（饱和度低、模糊度小），保证密集数据可读。
- 通知中心数据源 v1：DB 表 `admin_notifications`（id / actor / type / payload / read_at），由各模块写入；本 story 创建 schema + 列表 API + UI。
- 全局搜索为聚合查询：API `GET /api/admin/search?q=`，本 story 后端仅返回空（占位），后续模块 stories 接入。
- 仅桌面：移动端访问显示 hint 不报错。
- ⌘K 必须支持快捷键 + 触摸点击。

### 关联后续 stories
- 17-3 RBAC（菜单过滤）
- 17-5 ~ 17-12 各模块在 shell 内挂载
- E02 design tokens

### Project Structure Notes
- `apps/admin/src/App.tsx` / `router.tsx`
- `apps/admin/src/components/{AppShell,Sidebar,Topbar,NotificationCenter}.tsx`
- `packages/db/schema/admin.ts` (admin_notifications)
- `apps/api/src/routes/admin/notifications.ts`

### References
- `planning/epics/17-admin.md` ZY-17-04
- `planning/prds/12-admin/`

### 测试标准
- e2e：登录 → shell 渲染；切换主题；侧栏菜单按角色变化
- a11y：axe-core 0 critical
- 性能：FCP < 1.5s（admin desktop）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

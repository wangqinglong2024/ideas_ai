# Story 17.3: RBAC 中间件（路由级 + UI 级）

Status: ready-for-dev

## Story

作为 **后端 / 前端开发者**，
我希望 **拥有声明式 RBAC 中间件与 React Hook**，
以便 **所有 admin 路由与 UI 元素能基于权限矩阵进行统一鉴权与渲染**。

## Acceptance Criteria

1. 后端中间件 `requirePermissions(...keys)`：在路由 / handler 装饰，未通过返回 403 + `{code:'PERMISSION_DENIED', missing:['x']}`。
2. 支持组合：AND（默认）、OR（`requireAnyPermission(...)`）、嵌套（`{all:[...], any:[...]}`）。
3. 用户权限来源：JWT payload `permissions[]`（17-2）；`super_admin` 角色拥有特例通配（中间件直接放行）。
4. **资源级守卫**（v1.5 预留）：本 story 实现接口 `requireResource(handler)`，根据资源类型查策略；本 story 仅提供 stub + 文档，不接入。
5. 前端 Hook `usePermission(key)` / `useAnyPermission([keys])`：从 admin store 读权限。
6. 组件 `<Can perm="...">{children}</Can>`：默认 false 不渲染；fallback prop 可定制。
7. **路由级守卫**：admin app 路由表为每个 route 标 `meta.permissions: string[]`；路由 router beforeEnter 校验，缺权限重定向 `/403`。
8. **权限矩阵静态文档**：自动生成 `docs/admin/permission-matrix.md`，列出所有 routes / 所需权限，CI check 同步。
9. **错误码统一**：403 与 401 区分；未登录 401，已登录无权 403。
10. **审计**：被拒绝访问写 audit_logs（low severity）。
11. 单元测试：组合校验、super_admin 通配、缺失权限 → 403；UI 测试：Can 渲染分支。

## Tasks / Subtasks

- [ ] **后端中间件**（AC: 1-4, 9, 10）
  - [ ] `packages/auth/src/rbac/middleware.ts`
  - [ ] composer 函数
- [ ] **前端 Hook + Can**（AC: 5, 6）
  - [ ] `packages/auth/src/rbac/react.tsx`
- [ ] **路由 meta + 守卫**（AC: 7）
- [ ] **权限矩阵生成**（AC: 8）
  - [ ] CI script `pnpm gen:permission-matrix` + check
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- `super_admin` 通配仅在中间件层短路；前端 Hook 同样实现。
- 权限缓存于 JWT，权限变更后管理员需要重新登录或服务端踢出会话刷新（提供 `/api/admin/auth/refresh` 强制重发）。
- `<Can>` 不可作为安全屏障，仅 UX；后端必须独立校验。
- 路由 `/admin/*` 默认拒绝未声明 `meta.permissions` 的页面（强制开发者声明）。
- 本 story 完成后，所有后续 admin stories 均需声明权限。

### 关联后续 stories
- 17-1 / 17-2 提供权限来源
- 所有 17-4 ~ 17-12 必须声明 permissions
- 18-5 audit logs

### Project Structure Notes
- `packages/auth/src/rbac/middleware.ts`
- `packages/auth/src/rbac/react.tsx`
- `apps/admin/src/router/guards.ts`
- `scripts/gen-permission-matrix.ts`
- `docs/admin/permission-matrix.md`（自动生成）

### References
- `planning/epics/17-admin.md` ZY-17-03

### 测试标准
- 单元：组合 / super_admin / 缺失
- 集成：路由层 403 / 401 区分
- CI：权限矩阵 drift 检测

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

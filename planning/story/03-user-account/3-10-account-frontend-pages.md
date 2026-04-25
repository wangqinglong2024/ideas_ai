# Story 3.10: 前端账户页

Status: ready-for-dev

## Story

As a 用户,
I want 在前端使用美观、玻璃态、4 语国际化的登录 / 注册 / 找回 / 资料 / 设置 / 设备页面,
so that 我能完成所有账户相关操作。

## Acceptance Criteria

1. 实现 9 个页面 / 路由：
   - `/login`、`/register`、`/forgot-password`、`/reset-password?token=`
   - `/verify-email?token=`、`/me/profile`、`/me/settings`、`/me/devices`、`/me/danger-zone`（删除账号）
2. 全部使用 E02 设计系统组件：玻璃态卡片、Form、Toast、Modal。
3. **react-hook-form + zod resolver**：客户端校验与后端 zod schema 共享类型（通过 `@zhiyu/types`）。
4. 错误处理：Sentry breadcrumb；用户友好提示；网络错有 retry。
5. **i18n 4 语**（en/zh/vi/th；hi 翻译占位为 en，待 E04 完成）：所有文案走 `t('...')`。
6. 路由守卫：未登录访问 `/me/*` → 重定向 `/login?redirect=...`。
7. OAuth 按钮：Google / Apple；点击 → 重定向 `/v1/auth/oauth/...`；回调拿 token 存 SDK store。
8. 表单 a11y：label / aria / 错误关联；axe AA。
9. 性能：每页面 LCP < 2s 中端机 4G；JS bundle 单页 ≤ 80KB gzip。
10. E2E 测试（Playwright）：注册 → 验证 → 登录 → 改资料 → 远程登出 → 找回密码 → 删除账号取消。

## Tasks / Subtasks

- [ ] Task 1: 路由与 Layout（AC: #1, #6）
  - [ ] React Router v6 嵌套路由
  - [ ] AuthGuard 高阶
- [ ] Task 2: SDK 客户端（AC: #3, #7）
  - [ ] `packages/sdk/src/auth.ts` 全 endpoint
  - [ ] zustand auth store（user / tokens）
- [ ] Task 3: 登录 / 注册 / 找回 / 重置 / 验证 5 页（AC: #2, #3, #4, #5, #8）
- [ ] Task 4: 个人资料 / 设置 / 设备 / 危险区 4 页（AC: #2, #3, #4, #5, #8）
  - [ ] 头像上传（presign + 直传 R2）
- [ ] Task 5: i18n 4 语 keys（AC: #5）
- [ ] Task 6: E2E（AC: #10）
  - [ ] Playwright spec `e2e/account/*.spec.ts`
- [ ] Task 7: 性能验证（AC: #9）

## Dev Notes

### 关键约束
- token 存储：access in memory（zustand）+ refresh httpOnly cookie（推荐）；v1 折中存 localStorage（带 jti，按 spec/09 评估）
- OAuth 回调用 query 参数传 token（短 TTL，写入 store 后立即 history.replace 清 URL）
- avatar 直传 R2 用 fetch PUT，进度条用 XHR 或 fetch + progress event

### 依赖链
- 依赖：3-2, 3-3, 3-4, 3-5, 3-6, 3-7, 3-8, 3-9, 2-6, 2-7, 2-9, 2-4, S01 1-8 Sentry
- 被依赖：所有需要登录的业务页

### Project Structure Notes
```
apps/app/src/
  pages/
    auth/{Login,Register,ForgotPassword,ResetPassword,VerifyEmail}.tsx
    me/{Profile,Settings,Devices,DangerZone}.tsx
  guards/AuthGuard.tsx
  store/auth.ts
packages/sdk/src/
  auth.ts
  client.ts
e2e/account/
  register-login.spec.ts
  forgot-password.spec.ts
  delete-account.spec.ts
```

### Testing Standards
- vitest 单元（zustand store / utils）
- Playwright E2E 4 浏览器（Chromium/Firefox/Webkit/Mobile Safari）
- axe a11y 自动跑

### References
- [Source: planning/epics/03-user-account.md#ZY-03-10](../../epics/03-user-account.md)
- [Source: planning/ux/09-screens-app.md](../../ux/09-screens-app.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

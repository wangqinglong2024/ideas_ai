# Story 5.6: 顶栏 + 搜索入口

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **顶部有 logo、搜索、通知和知语币入口**，
以便 **不离开当前页就能快速搜索与查看通知 / 余额**。

## Acceptance Criteria

1. 顶栏左侧：知语 logo（点击回到 `/`）。
2. 中部：当前页标题（按路由动态渲染，可缺省）。
3. 右侧依次：搜索图标 → 触发全站搜索 modal（5-7 提供）/ 通知图标（带未读红点）→ 跳 `/notifications` 或打开 sheet（5-9） / 知语币入口（图标 + 余额数字简写）→ 跳 `/coins`。
4. sticky top + 玻璃态；与底部导航视觉对齐。
5. 安全区适配：`env(safe-area-inset-top)` 留白。
6. 未读红点数据来自 `useUnreadNotifications()` hook（基于 5-9）。
7. 知语币余额来自 `useUserCoins()` hook，登录态变化自动更新；未登录显示登录入口替代。
8. 4 语 i18n。

## Tasks / Subtasks

- [ ] **组件实现**（AC: 1,2,3,4,5）
  - [ ] `<TopBar>` 三段布局（左 logo / 中 title / 右 actions）
  - [ ] sticky + backdrop-blur
  - [ ] safe-area-inset-top

- [ ] **动态标题**（AC: 2）
  - [ ] 路由 `staticData.title` 或 `useTitle()` hook
  - [ ] 缺省时不渲染中部

- [ ] **未读 / 余额 hooks**（AC: 6,7）
  - [ ] `useUnreadNotifications` 调用 GET `/api/notifications/unread-count`（30s polling 或 SSE）
  - [ ] `useUserCoins` 调用 GET `/api/me/wallet`，依赖 auth 态
  - [ ] 数字简写工具：1234 → 1.2k

- [ ] **未登录态**（AC: 7）
  - [ ] 知语币位置变为「登录」按钮，跳 `/auth/login`

- [ ] **i18n**（AC: 8）

## Dev Notes

### 关键约束
- 顶栏在 modal 打开时可被遮罩覆盖，z-index 需协调（`50` 顶栏 / `60` modal）。
- 知语币余额接口可能未在 M1 实现，提供 stub 返回 0。

### 关联后续 stories
- 5-7 提供搜索 modal
- 5-9 提供通知 sheet
- E03 用户态 hooks 复用

### Project Structure Notes
- `apps/app/src/components/TopBar.tsx`
- `apps/app/src/hooks/use-unread-notifications.ts`
- `apps/app/src/hooks/use-user-coins.ts`

### References
- `planning/epics/05-app-shell.md` ZY-05-06
- `planning/ux/06-navigation-routing.md` § 2

### 测试标准
- 单元：数字简写工具
- E2E：登录前后右上角切换
- 视觉：safe-area 留白

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

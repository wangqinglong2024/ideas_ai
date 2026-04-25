# Story 5.10: App 容器响应式（手机 / 平板 / 桌面）

Status: ready-for-dev

## Story

作为 **跨设备用户**，
我希望 **在手机 / 平板 / 桌面打开知语都体验良好**，
以便 **不需要专门下载桌面版或使用尴尬的移动版**。

## Acceptance Criteria

1. 三档断点：< 640（移动）/ 640-1024（平板）/ ≥ 1024（桌面）。
2. 移动端：单栏 + 底部导航（5-5）+ 顶栏（5-6）。
3. 平板：单栏内容 + 顶栏；底部导航保留；内容区水平内边距增加。
4. 桌面：左侧栏 240-280px（含 5 项导航 + 二级菜单空间）+ 右侧主内容；底部导航隐藏。
5. 内容主体最大宽度 1200px，居中；额外区域作为留白。
6. 容器查询（`@container`）应用于关键卡片组件，使其在不同列宽下布局变化。
7. 平滑切换：调整窗口大小不闪烁、不丢状态。
8. 桌面侧栏可折叠（图标-only），偏好持久化 localStorage。

## Tasks / Subtasks

- [ ] **断点与容器**（AC: 1,5,6）
  - [ ] Tailwind 配置三档 + container queries 插件
  - [ ] 主容器组件 `<AppContainer>`

- [ ] **桌面侧栏**（AC: 4,8）
  - [ ] `<DesktopSidebar>` 含 5 项 + logo + 折叠按钮
  - [ ] localStorage `sidebar-collapsed` 持久化

- [ ] **平板适配**（AC: 3）
  - [ ] 内容区水平 padding 24-48px

- [ ] **响应式切换**（AC: 4,7）
  - [ ] `_app.tsx` 中按断点切换 BottomNav / DesktopSidebar
  - [ ] CSS only 不重挂载，避免 flicker

- [ ] **容器查询样例**（AC: 6）
  - [ ] 课程卡片在 ≥ 480px 容器宽度下显示更多元数据

## Dev Notes

### 关键约束
- 容器查询在 iOS 16+ 与 Chrome 105+ 支持；老浏览器降级到媒体查询。
- 折叠侧栏宽度 64px；展开 240-280px；切换 transition 200ms。

### 关联后续 stories
- 5-5 / 5-6 已就位
- 后续业务页面遵循断点样式

### Project Structure Notes
- `apps/app/src/components/AppContainer.tsx`
- `apps/app/src/components/DesktopSidebar.tsx`
- `apps/app/src/routes/_app.tsx`
- `apps/app/tailwind.config.ts`

### References
- `planning/epics/05-app-shell.md` ZY-05-10
- `planning/ux/05-*`

### 测试标准
- 视觉回归：三档断点截图
- E2E：调整窗口大小不重渲染主内容
- 持久化：刷新后侧栏折叠态保持

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

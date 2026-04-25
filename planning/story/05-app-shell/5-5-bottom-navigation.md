# Story 5.5: 底部导航 5 项

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **底部有清晰的 5 项导航（玩 / 学 / 发现 / 知语币 / 我）**，
以便 **随时一键切换主功能区，不迷路**。

## Acceptance Criteria

1. 5 项 tab：发现（`/`）/ 学（`/learn`）/ 玩（`/games`）/ 知语币（`/coins`）/ 我（`/me`），居中"玩"为视觉强调点。
2. 玻璃态背景（backdrop-blur + 半透明）+ sticky 在视口底部。
3. 激活态：图标 + 文字高亮；当前 tab 路径前缀匹配即激活。
4. 安全区适配：`env(safe-area-inset-bottom)` 留白。
5. 切换动效：图标轻微 scale + 文字淡入；不卡顿。
6. 4 语 i18n 文本（发现 / 学 / 玩 / 知语币 / 我）。
7. 桌面 ≥ 1024px 时**隐藏**底部导航，由侧栏替代（侧栏在 5-10 实现，本 story 仅做隐藏切换）。
8. 键盘 Tab 可聚焦，回车触发跳转，符合 a11y。

## Tasks / Subtasks

- [ ] **组件实现**（AC: 1,2,3,5）
  - [ ] `<BottomNav>` 渲染 5 项
  - [ ] 使用 `<Link>` 与 `useMatchRoute` 判断激活
  - [ ] Framer Motion 切换动效

- [ ] **样式与安全区**（AC: 2,4）
  - [ ] 玻璃态 className（Tailwind 自定义）
  - [ ] padding-bottom: env(safe-area-inset-bottom)

- [ ] **i18n**（AC: 6）
  - [ ] 在 `nav.json` 添加 4 语 key

- [ ] **响应式**（AC: 7）
  - [ ] 容器 query：`@container (min-width: 1024px)` 时 hidden

- [ ] **a11y**（AC: 8）
  - [ ] role="navigation"，aria-label="主导航"
  - [ ] 每项 tabIndex=0 + 可见 focus ring

## Dev Notes

### 关键约束
- iOS Safari home indicator 区域需要 16-24px 安全留白。
- 玻璃态在低端 Android 性能可能差，提供降级（fallback solid bg）。

### 关联后续 stories
- 5-3 router 已就位
- 5-10 桌面侧栏会替代它
- 5-6 顶栏与之搭配

### Project Structure Notes
- `apps/app/src/components/BottomNav.tsx`
- `apps/app/src/routes/_app.tsx`（渲染处）
- `apps/app/src/lib/i18n/locales/{en,vi,th,id}/nav.json`

### References
- `planning/epics/05-app-shell.md` ZY-05-05
- `planning/ux/06-navigation-routing.md` § 3

### 测试标准
- 单元：激活态计算
- E2E：5 项可点；键盘可达
- 视觉：safe-area 在 iPhone 14 留白正确

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

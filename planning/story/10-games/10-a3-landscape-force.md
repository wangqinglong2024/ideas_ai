# Story 10.A3: 横屏强制 + 桌面 16:9 画布

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **进入任意游戏时移动端竖屏自动遮罩、桌面端获得 16:9 居中画布**，
以便 **所有游戏在统一坐标系下保证 60fps 与一致体验**。

## Acceptance Criteria

1. 提供 `<LandscapeGate />` 包装组件：包裹任意 `/games/*` 子页面。
2. 移动端竖屏：显示遮罩 "请旋转手机至横屏" + 旋转图标，监听 `orientationchange` 自动消失。
3. 移动端横屏：尝试调用 Fullscreen API（用户首次手势触发），失败则降级提示。
4. 桌面端：始终渲染 16:9 内置画布（如 1280×720 逻辑分辨率），自适应缩放，黑色 letterbox。
5. 画布坐标系：所有游戏使用统一 `GameStage` 提供的 `{ width: 1280, height: 720 }` 逻辑像素，DPR 自适应。
6. iOS Safari 不支持横屏 Fullscreen 的兼容降级：仅做 CSS rotate(90deg) 替代方案，禁止白屏。
7. 不调用经济 / 奖励 API。
8. 提供 `useStageSize()` hook 给 12 款游戏使用。

## Tasks / Subtasks

- [ ] **LandscapeGate**（AC: 1,2,3,6）
  - [ ] `packages/games-shared/src/stage/LandscapeGate.tsx`
  - [ ] orientation 监听 / Fullscreen API / iOS 降级
- [ ] **GameStage**（AC: 4,5,8）
  - [ ] `packages/games-shared/src/stage/GameStage.tsx`：固定 16:9 画布
  - [ ] `useStageSize` hook
  - [ ] 自适应 resize + DPR
- [ ] **接入**（AC: 1）
  - [ ] `/games/[slug]/layout.tsx` 注入 `<LandscapeGate><GameStage>...`
- [ ] **测试**（AC: 2,3,4）
  - [ ] e2e（playwright）：viewport 切换 / 横竖屏 / 桌面缩放断言
  - [ ] 视觉回归 storybook 快照

## Dev Notes

### 关键约束
- iOS Safari 无 Fullscreen API 横屏：使用 `transform: rotate(90deg)` + 锁定 body 滚动作为视觉横屏方案。
- 所有 12 款游戏不允许使用 `window.innerWidth` 直读，必须 `useStageSize()`。
- DPR > 1 时画布像素需 ×DPR 渲染但 CSS 尺寸不变。

### Project Structure Notes
- `packages/games-shared/src/stage/LandscapeGate.tsx`
- `packages/games-shared/src/stage/GameStage.tsx`
- `apps/web/src/app/games/[slug]/layout.tsx`

### References
- [Source: planning/epics/10-games.md#ZY-10-A3 GM-FR-002]
- [Source: planning/spec/11-game-engine.md]

### 测试标准
- e2e：移动竖→横遮罩流转 / 桌面 letterbox
- 视觉回归：4 设备视口快照
- 性能：进入游戏首帧 < 800ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

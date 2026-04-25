# Story 9.9: 强制横屏 + 全屏模式

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **进入游戏时自动切横屏并全屏，竖屏时显示「请旋转设备」遮罩**，
以便 **获得最大游戏画布**。

## Acceptance Criteria

1. games-host webview 进入游戏路由时调用 expo-screen-orientation 锁定横屏。
2. 游戏退出时恢复 portrait。
3. 浏览器 Web 端：调用 Fullscreen API，竖屏时遮罩。
4. 遮罩 UI 含 4 语种文案 + 旋转图标动画。
5. 平板检测：横竖皆可时不强制（保留默认）。
6. 失败回退：API 不支持 → 警告 toast 但允许游戏继续。
7. iOS Safari Web 全屏受限：使用 viewport meta + CSS 100vh 兜底。

## Tasks / Subtasks

- [ ] **方向锁定**（AC: 1,2）
  - [ ] `apps/games-host/src/orientation.ts`
- [ ] **遮罩组件**（AC: 3,4）
  - [ ] `apps/games-host/src/components/RotateOverlay.tsx`
- [ ] **平板检测**（AC: 5）
- [ ] **iOS 兜底**（AC: 7）

## Dev Notes

### 关键约束
- 平板（aspect ratio < 1.5）允许竖屏，避免遮罩误伤。
- expo-screen-orientation 在 Android 14+ 需要权限声明。

### 关联后续 stories
- 9-1 包骨架
- 10-* 全部游戏受益

### Project Structure Notes
- `apps/games-host/src/orientation.ts`
- `apps/games-host/src/components/RotateOverlay.tsx`

### References
- `planning/epics/09-game-engine.md` ZY-09-09

### 测试标准
- 真机：iPhone / Android 手机 / iPad
- 视觉：遮罩 4 语种

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

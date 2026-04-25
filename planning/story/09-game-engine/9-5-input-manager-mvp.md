# Story 9.5: InputManager MVP（点击 / 拖拽 / 滑动）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **统一的 InputManager 在触摸 / 鼠标 / 触控板下提供一致的事件**，
以便 **12 款游戏共用 click / drag / swipe 接口**。

## Acceptance Criteria

1. 提供事件 API：`on('tap', cb)`、`on('drag', cb)`、`on('swipe', cb)`、`on('release', cb)`。
2. 自动识别 swipe 方向（up / down / left / right）+ velocity。
3. drag 触发阈值（>10px）防止误触。
4. 多点触控基础：仅最先触摸的 finger 生效（MVP 简化）。
5. 与 PixiJS interaction 系统协同（不破坏 hitArea）。
6. 提供 `disable() / enable()` 全局控制（如 Settle 场景禁用输入）。
7. 单元测试：模拟 pointer 事件序列输出 swipe 方向。

## Tasks / Subtasks

- [ ] **核心**（AC: 1,3,4,5,6）
  - [ ] `src/core/InputManager.ts`
- [ ] **swipe 识别**（AC: 2）
- [ ] **测试**（AC: 7）

## Dev Notes

### 关键约束
- 不引入第三方 gesture lib（zingtouch 等），手写以保持 < 5KB。
- 多点触控完整版在 9-5 v1 story（input-manager-v1）。

### 关联后续 stories
- 9-5 v1（多点 + 旋转 + 缩放）
- 10-* 游戏使用

### Project Structure Notes
- `packages/game-engine/src/core/InputManager.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-05

### 测试标准
- 单元：swipe 8 个方向（包括对角）
- 集成：drag 阈值

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

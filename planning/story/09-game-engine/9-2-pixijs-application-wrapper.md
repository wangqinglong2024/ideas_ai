# Story 9.2: PixiJS Application 包装器

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **`createApp(options)` 一行启动一个 PixiJS v8 Application，自动适配设备 DPR、屏幕尺寸与全屏横屏**，
以便 **12 款游戏都能以一致的方式接入渲染**。

## Acceptance Criteria

1. `createApp({ canvas, width, height, backgroundColor, antialias })` 返回 PixiJS Application 实例 + lifecycle 钩子。
2. 自动 resize：监听 window resize / orientationchange，按 `aspect ratio` 重算 stage scale。
3. DPR：自动按 devicePixelRatio 设置 resolution（上限 2 防内存爆）。
4. ticker：暴露 onUpdate(dt) / onLateUpdate(dt) 钩子。
5. destroy：释放 GL context + textures。
6. 默认背景色透明。
7. 类型完整。
8. 单元测试：模拟 resize 事件验证 stage scale 正确。

## Tasks / Subtasks

- [ ] **createApp**（AC: 1,3,5,6,7）
  - [ ] `src/core/createApp.ts`
- [ ] **resize 处理**（AC: 2）
  - [ ] `src/core/resize.ts`
- [ ] **ticker 包装**（AC: 4）
- [ ] **测试**（AC: 8）

## Dev Notes

### 关键约束
- PixiJS v8 API（与 v7 接口变更明显），坚持 v8。
- 不直接渲染游戏内容，本 story 仅基础设施。

### 关联后续 stories
- 9-3 SceneManager 注册 ticker
- 9-4 / 9-5 / 9-6 注入 app

### Project Structure Notes
- `packages/game-engine/src/core/createApp.ts`
- `packages/game-engine/src/core/resize.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-02

### 测试标准
- 单元：resize / dpr clamp
- 性能：60fps idle

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 9.4: AssetLoader MVP（图片 / 音频 / 字体）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **统一的 AssetLoader 在 Preload 场景拉取所有资源并显示进度条**，
以便 **进入 Round 时所有素材就绪、无卡顿**。

## Acceptance Criteria

1. `loader.add(manifest)` 接受 `{ images, audio, fonts, json }` 列表。
2. `loader.load()` 返回 Promise + 进度回调 `(progress: 0~1)`。
3. 失败重试 2 次，最终失败 reject 并触发 ErrorBoundary。
4. 资源缓存（同 url 二次加载从内存返回）。
5. 体积约束：单游戏总资源 < 5MB（warning 在超出时打印）。
6. CDN：所有资源通过环境变量 `VITE_GAME_ASSETS_BASE` 拼接。
7. 单元测试：成功 / 失败 / 缓存命中。

## Tasks / Subtasks

- [ ] **loader 主体**（AC: 1,2,4,6）
  - [ ] `src/core/AssetLoader.ts`
- [ ] **重试**（AC: 3）
- [ ] **进度 UI**（AC: 2）
  - [ ] `src/scenes/Preload/index.ts`
- [ ] **体积告警**（AC: 5）

## Dev Notes

### 关键约束
- 字体加载使用 FontFace API；不要 hard-code @font-face css。
- 音频使用 9-6 AudioManager，本 loader 只负责 fetch + decode。

### 关联后续 stories
- 9-3 Preload 场景调用
- 9-6 AudioManager

### Project Structure Notes
- `packages/game-engine/src/core/AssetLoader.ts`
- `packages/game-engine/src/scenes/Preload/`

### References
- `planning/epics/09-game-engine.md` ZY-09-04

### 测试标准
- 单元：成功 / 失败 / 缓存
- 集成：5MB warning

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

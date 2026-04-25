# Story 9.6: AudioManager（howler 包装 + 音效 / BGM / 静音）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **AudioManager 提供 BGM 循环、音效一次性播放、全局静音、音量调节**，
以便 **12 款游戏统一使用，避免重复音效堆叠**。

## Acceptance Criteria

1. API：`audio.bgm.play(name) / stop()`、`audio.sfx.play(name)`、`audio.setMuted(bool)`、`audio.setVolume(0~1)`。
2. 静音状态持久化到 localStorage。
3. iOS Safari 首次需用户手势激活 audio context；提供 `audio.unlock()` 方法在 Lobby 首次点击调用。
4. 同名 sfx 短时间（<50ms）忽略，防爆音。
5. BGM 切换时淡入淡出 200ms。
6. 资源由 9-4 AssetLoader 预加载并注入。
7. 单元测试 + iOS 真机验证。

## Tasks / Subtasks

- [ ] **核心**（AC: 1,2,4,5）
  - [ ] `src/core/AudioManager.ts`（howler）
- [ ] **iOS unlock**（AC: 3）
- [ ] **AssetLoader 集成**（AC: 6）
- [ ] **测试**

## Dev Notes

### 关键约束
- howler v2 已自动处理大多数 iOS 行为，但仍需 unlock 兜底。
- BGM 仅同时 1 首；sfx 并行 ≤ 8 个（howler 池）。

### 关联后续 stories
- 9-4 / 9-1 前置
- 10-* 游戏使用

### Project Structure Notes
- `packages/game-engine/src/core/AudioManager.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-06

### 测试标准
- 单元：mute 持久化
- 真机：iOS / Android 各 1 台

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 9.3: SceneManager MVP（Lobby → Settings → Preload → Round → Settle）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **统一的 SceneManager 提供 5 个标准场景与 60s 倒计时回合**，
以便 **12 款游戏聚焦玩法本身，无需各自实现循环 / 结算**。

## Acceptance Criteria

1. 状态机：`Lobby → Settings → Preload → Round → Settle → Lobby`，**不存在** Victory / NextLevel / LevelSelect 状态。
2. `Round` 默认 `durationMs = 60_000` 写死，**不可被业务覆盖为非 60s**（提供常量 + readonly）。
3. `Settle` 仅展示「得分 / 用时 / 错题 / 再玩一局 / 返回」按钮 5 项，**不出现**三星 / 排行榜 / 下一关。
4. 「再玩一局」=`SceneManager.replay()` 重置回合状态后跳 Preload。
5. 「返回」=回到外层 host（webview close / route back）。
6. 提供 hooks：`onEnter(state) / onExit(state) / onTick(state, dt)`。
7. 内部时间线由 9-2 ticker 驱动；倒计时精度 ±100ms。
8. 单元测试：60s 自动转 Settle，replay 后状态归零。

## Tasks / Subtasks

- [ ] **状态机**（AC: 1,4,5,6）
  - [ ] `src/core/SceneManager.ts`
- [ ] **Round 计时**（AC: 2,7）
  - [ ] `src/core/Round.ts`，`DURATION_MS = 60_000` const
- [ ] **Settle 默认 UI**（AC: 3）
  - [ ] 仅 5 按钮，不开放配置
- [ ] **测试**（AC: 8）

## Dev Notes

### 关键约束
- `DURATION_MS` 为 readonly 常量，不接受 RoundConfig 输入覆盖。
- 此 story 是全局 60s 规则的物理强制点，禁止松动。
- Settle UI 文本走 i18n key（与 04 i18n 集成）。

### 关联后续 stories
- 9-1 包骨架前置
- 12 款游戏（10-* stories）接入

### Project Structure Notes
- `packages/game-engine/src/core/SceneManager.ts`
- `packages/game-engine/src/core/Round.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-03（AC: 无 Victory / NextLevel）
- `games/shared/05-round-loop.md`

### 测试标准
- 单元：状态转换矩阵
- 集成：60s 自动 settle

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

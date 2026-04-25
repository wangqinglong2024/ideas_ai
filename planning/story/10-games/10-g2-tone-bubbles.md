# Story 10.G2: 声调泡泡 MVP（tone-bubbles）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **把上升的拼音泡泡拖入对应的 1-4 声调桶里**，
以便 **强化声调辨识反应**。

## Acceptance Criteria

1. 5 关 / 单难度 / HSK1；每关 30s。
2. 屏幕底部 4 个桶（一声 / 二声 / 三声 / 四声）；上升泡泡显示无调拼音 + 汉字。
3. 拖拽（移动）/ 点击 + 选桶（桌面）入桶判定：正确 +10，错误 -1 命，3 命止。
4. 结算：得分 / 用时 / 错题 / "再玩"；无奖励 / 无排行榜 / 无三星。
5. 错题入 SRS（仅汉字 + 错误次数）。
6. 横屏 + 统一 GameStage + 词包来自 A2。
7. 60fps；泡泡数同时 ≤ 8。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由入口（AC: 6）
- [ ] 泡泡 spawner / 上升动画 / 拖拽（AC: 2,3,7）
- [ ] 4 桶判定 / 命数（AC: 3）
- [ ] 结算 + SRS（AC: 4,5）
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 多轻声 / 多模式 / 教学 / 三星 → backlog。
- 泡泡数≤8 防止性能掉帧。

### Project Structure Notes
- `apps/web/src/app/games/tone-bubbles/page.tsx`
- `apps/web/src/games/tone-bubbles/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G2]
- [Source: planning/spec/11-game-engine.md]

### 测试标准
- e2e 通关 / 错题入 SRS / 60fps

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

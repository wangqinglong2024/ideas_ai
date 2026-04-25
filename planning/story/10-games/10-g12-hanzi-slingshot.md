# Story 10.G12: 汉字弹弓 MVP（hanzi-slingshot）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **像愤怒小鸟一样用弹弓抛出"拼音弹"击中正确汉字目标**，
以便 **在物理玩法中复习音形匹配**。

## Acceptance Criteria

1. 单关 / HSK1 词包；目标汉字 5 个 / 子弹 5 发。
2. 屏幕显示题面拼音；玩家拖弹弓（角度 + 力度）发射，命中正确目标 +10，错误 -1 子弹。
3. 子弹耗尽即结算；3 命外加错击 ≤ 5 次容差（依然按错次记 SRS）。
4. 结算 / 错题 / 再玩；无奖励 / 三星 / 排行。
5. 错题入 SRS。
6. 横屏 + GameStage + 词包 A2；引入 Matter.js 物理。
7. 60fps；同屏物体 ≤ 30。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] Matter.js world / body 管理
- [ ] 弹弓拖拽 / 抛物 / 碰撞回调
- [ ] 题面引擎 / 命中判定
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- Matter.js 仅本游戏使用，统一接入 `packages/games-shared/src/physics/`（仅本期需要的最小封装）。
- 不做多关 / 编辑器 / 道具。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-slingshot/page.tsx`
- `apps/web/src/games/hanzi-slingshot/*`
- `packages/games-shared/src/physics/`

### References
- [Source: planning/epics/10-games.md#ZY-10-G12]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

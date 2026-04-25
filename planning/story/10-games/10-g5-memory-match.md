# Story 10.G5: 翻牌记忆 MVP（memory-match）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在 4×4 翻牌中把"汉字"卡和对应"拼音"卡配对**，
以便 **巩固音形对应记忆**。

## Acceptance Criteria

1. 4×4 = 16 卡 = 8 对；5 关 / HSK1 词包；不限时（最大 90s 上限）。
2. 翻 2 卡：相同对消除（+10），错误闭合（-1 命，3 命止）。
3. 结算 / 错题 / 再玩；无奖励 / 排行 / 三星。
4. 错题：当局未配上的字进 SRS。
5. 横屏 + GameStage + 词包 A2。
6. 60fps。
7. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 翻牌动画 / 配对 / 命数
- [ ] 结算 + SRS
- [ ] i18n / 测试

## Dev Notes

### 关键约束
- 不做时间挑战 / 多模式 / 道具。

### Project Structure Notes
- `apps/web/src/app/games/memory-match/page.tsx`
- `apps/web/src/games/memory-match/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G5]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

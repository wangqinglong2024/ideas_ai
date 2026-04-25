# Story 10.G9: 汉字贪吃蛇 MVP（hanzi-snake）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **控制蛇按题面顺序"吃字"组成词，撞身则死**，
以便 **在贪吃蛇玩法中练习构词顺序**。

## Acceptance Criteria

1. 5 关 / HSK1 词包；每关给定 5 个目标词。
2. 棋盘上同时有干扰字与目标字；按目标词正确顺序吃中得分（+10），吃错 -1 命，3 命止。
3. 撞身或撞墙：当局结束。
4. 结算 / 错题 / 再玩；无奖励 / 三星 / 排行。
5. 错题入 SRS。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；蛇格刷新固定 step。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 棋盘 / 蛇移动 / 字 spawn
- [ ] 题词进度 / 计分
- [ ] 结算 + SRS
- [ ] i18n / 测试

## Dev Notes

### 关键约束
- 不做加速 / 道具 / 多地图。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-snake/page.tsx`
- `apps/web/src/games/hanzi-snake/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G9]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

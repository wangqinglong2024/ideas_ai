# Story 10.G4: 汉字消消乐 MVP（hanzi-match3）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在 6×8 棋盘上交换相邻汉字消除三同**，
以便 **在三消玩法中反复曝光汉字**。

## Acceptance Criteria

1. 6×8 棋盘 / 5 关 / 60s 一局 / HSK1 词包。
2. 三同字横向或纵向连成一线即消除并掉落补充；消除得分 +10。
3. 不连消、不连击额外奖励、不爆炸特殊块（MVP 排除）。
4. 结算 / 错题 / 再玩；错题来源：每关结束后随机抽 5 个未消除字判错记入 SRS（最小子集策略）。
5. 横屏 + GameStage + 词包 A2。
6. 60fps；棋盘渲染对象池化。
7. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 + GameStage
- [ ] 棋盘 / 交换动画 / 匹配检测 / 重力填充
- [ ] 计分 / 计时
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 不做特殊块 / 连击奖励 / 关卡星图。
- 错题策略：每关随机抽 5 字进 SRS，避免无错题信号。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-match3/page.tsx`
- `apps/web/src/games/hanzi-match3/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G4]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 10.G7: 汉字俄罗斯方块 MVP（hanzi-tetris）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **下落方块带汉字，水平排满后若汉字能拼成有效词即额外消除**，
以便 **在经典玩法中学习构词**。

## Acceptance Criteria

1. 单局 3 分钟 / HSK1 词包；经典 7 形方块。
2. 水平整行消除按经典规则。
3. 简化"拼词消除"：仅水平整行内连续 2-4 字命中 HSK1 词表则额外消除该子段（不做 L 形 / 垂直）。
4. 结算 / 错题 / 再玩；无奖励 / 排行 / 三星。
5. 错题来源：本局未拼成的字按出现频次取最低 5 个进 SRS（最小子集）。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；下落 step ≥ 16ms。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 7 形方块 + 旋转 + 锁定 + 消行
- [ ] 词典扫描（仅水平 / 长度 2-4）
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 不做 SRS 全词信号、垂直拼词、L 形匹配（防需求蔓延）。
- 词典使用 A2 词包 + 内置 HSK1 词组（约 200 词）。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-tetris/page.tsx`
- `apps/web/src/games/hanzi-tetris/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G7]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

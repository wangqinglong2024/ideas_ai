# Story 10.G11: 汉字跑酷 MVP（hanzi-runner）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **横版自动奔跑，根据题面拼音从 3 障碍门中选正确汉字门通过**，
以便 **在跑酷中训练快速选择**。

## Acceptance Criteria

1. 单关 / HSK1 词包；时长 ~60s。
2. 自动右行；定时遇到 3 道并排"汉字门"，玩家上下切换轨道选择正确门。
3. 选错门：-1 命，3 命止；选对：+10。
4. 结算 / 错题 / 再玩；无奖励 / 三星 / 排行。
5. 错题入 SRS。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；视差背景 + 角色 sprite 动画。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 角色控制 / 3 轨切换
- [ ] 障碍门 spawner / 题面引擎
- [ ] 视差背景
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 不做距离记录 / 排行 / 道具 / 多角色。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-runner/page.tsx`
- `apps/web/src/games/hanzi-runner/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G11]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

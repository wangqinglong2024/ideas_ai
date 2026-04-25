# Story 10.G6: 汉字忍者 MVP（hanzi-ninja）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **像切水果一样按拼音正确"切"飞行汉字**，
以便 **在 60s 内训练拼音→形快速识别**。

## Acceptance Criteria

1. 单关 / 60s / 3 命 / HSK1 词包。
2. 屏幕显示题面拼音；汉字飞行物从下抛出，上方显示候选汉字组。
3. 用户拖拽划过对应汉字飞行物即切中（+10）；切错 / 漏切 -1 命。
4. 结算 / 错题 / 再玩；无奖励 / 三星 / 排行。
5. 错题入 SRS。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；同屏飞行物 ≤ 6。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 抛物物理（简化常重力）/ 切割轨迹检测
- [ ] 题面引擎 / 计分
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 物理使用简化重力，不引入 Matter（Matter 仅 G12 用）。
- 多模式（汉字→拼音）/ 多关卡 → backlog。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-ninja/page.tsx`
- `apps/web/src/games/hanzi-ninja/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G6]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

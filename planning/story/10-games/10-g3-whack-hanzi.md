# Story 10.G3: 打地鼠 MVP（whack-hanzi）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **看到题面（拼音或翻译）后从 5×3 洞中拍中正确汉字**，
以便 **训练形音意快速识别反应**。

## Acceptance Criteria

1. 5×3 网格、5 关、HSK1 词包；每关 30s。
2. 顶部题面随机给出"拼音"或"翻译"；正确汉字与若干干扰项随机冒出，1-1.5s 出收。
3. 拍中正确：+10；拍错：-1 命，3 命止。
4. 结算 / 错题 / 再玩；无星级、无奖励、无排行。
5. 错题入 SRS（汉字 + 错次）。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；并发地鼠 ≤ 6。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 + GameStage 接入
- [ ] 5×3 网格 / 题面引擎 / 出收动画
- [ ] 命中判定 / 命数
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 题面只出"拼音 / 翻译"二选一，不出释义扩展。
- 多模式 / 多难度 → backlog。

### Project Structure Notes
- `apps/web/src/app/games/whack-hanzi/page.tsx`
- `apps/web/src/games/whack-hanzi/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G3]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

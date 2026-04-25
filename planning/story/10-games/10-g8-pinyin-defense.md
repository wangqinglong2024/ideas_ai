# Story 10.G8: 拼音塔防 MVP（pinyin-defense）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在 1 张地图上输入拼音触发塔攻击来阻挡汉字怪物**，
以便 **在塔防玩法中练习拼音听打**。

## Acceptance Criteria

1. 1 地图 / 3 波 / 单塔类型 / HSK1 词包。
2. 怪物头顶显示汉字；玩家在底部键盘输入对应拼音（无声调）触发最近塔攻击。
3. 输入正确：塔射击命中（+10）；输入错误 / 漏：怪物可能突破（-1 命，3 命破防止）。
4. 结算 / 错题 / 再玩；无奖励 / 排行 / 三星 / 升级塔 / 多类型塔。
5. 错题入 SRS（汉字 + 错次）。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；同屏怪物 ≤ 8。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 路径系统（固定 polyline）
- [ ] 怪物 spawner / 移动 / 命中判定
- [ ] 单塔 / 射击 / 输入触发
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- L 估算最大；严守"1 图 / 3 波 / 1 塔"边界，禁止扩范围。
- 多塔 / 升级 / 道具 / 多地图 → backlog。

### Project Structure Notes
- `apps/web/src/app/games/pinyin-defense/page.tsx`
- `apps/web/src/games/pinyin-defense/*`

### References
- [Source: planning/epics/10-games.md#ZY-10-G8]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

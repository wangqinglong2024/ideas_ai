# Story 10.G1: 拼音射击 MVP（pinyin-shooter）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **通过拼音键盘射击下落汉字，巩固音形匹配**，
以便 **在 60s/局内强化拼音听打反应**。

## Acceptance Criteria

1. 5 关 / 单难度（HSK1 词包），每关 60s 单局；超时或 3 次失败结束。
2. 屏幕顶部下落汉字（速度恒定），玩家用屏幕底部键盘输入正确拼音（不带声调）即击毁。
3. 输入错误：扣 1 命；正确：得 10 分 + 字销毁动画。
4. 结算：得分 / 用时 / 错题列表 / "再玩一次" / "返回"；无星级、无奖励、无排行榜。
5. 错题：通关后批量推 SRS（GM-FR-005 最小子集，仅汉字 + 错误次数）。
6. 横屏强制（A3）；词包来自 A2；使用 `GameStage` 统一画布。
7. 60fps（中端 Android：Pixel 4a 等）；首帧 < 1s。
8. 不调用任何经济 / 奖励 / 排行榜 API。

## Tasks / Subtasks

- [ ] **入口与路由**（AC: 6）
  - [ ] `apps/web/src/app/games/pinyin-shooter/page.tsx` 包裹 `LandscapeGate + GameStage`
- [ ] **核心循环**（AC: 1,2,3,7）
  - [ ] `apps/web/src/games/pinyin-shooter/`：scene / spawner / input / scoring
  - [ ] requestAnimationFrame 循环；离屏 canvas
- [ ] **拼音键盘**（AC: 2)
  - [ ] 26 字母 + Backspace + 确认；移动端友好
- [ ] **结算页**（AC: 4)
  - [ ] 错题列表组件复用 `packages/games-shared/src/result/`
- [ ] **SRS 推送**（AC: 5)
  - [ ] 调用 `POST /api/srs/batch`（E07）
- [ ] **性能**（AC: 7)
  - [ ] sprite 合图 / 字体子集 / 对象池
- [ ] **i18n**（AC: 4)
  - [ ] 4 语 UI key
- [ ] **测试**
  - [ ] e2e：完整通关流 / 错题入 SRS 断言
  - [ ] 性能：fps 监控

## Dev Notes

### 关键约束
- 仅 1 难度、1 词包；难度 / 多词包 / 三星 / 排行榜 / 教学 / IAP 全部进入 backlog。
- 拼音不带声调比对（与玩法约束一致）。
- 错题阈值：单字错 ≥ 1 次即入 SRS。

### Project Structure Notes
- `apps/web/src/app/games/pinyin-shooter/page.tsx`
- `apps/web/src/games/pinyin-shooter/*`
- `packages/games-shared/src/result/`

### References
- [Source: planning/epics/10-games.md#ZY-10-G1]
- [Source: planning/spec/11-game-engine.md]
- [Source: planning/prds/04-games/]

### 测试标准
- 单元：scoring / spawner 速度
- e2e：通关 + 错题入 SRS
- 性能：60fps Pixel 4a

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# Story 10.G10: 汉字节奏 MVP（hanzi-rhythm）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **跟随 1 BPM 1 曲目的节拍点击落下的汉字音节**，
以便 **以节奏游戏方式听写练习**。

## Acceptance Criteria

1. 1 BPM / 1 曲目 / HSK1 词包；曲长 ~90s。
2. 4 轨道下落音符，音符上显示拼音；玩家在判定线点击对应轨道。
3. 完美 / 良好 / 漏击三档（仅得分差异；不显示连击奖励 / 评级）。
4. 结算 / 错题 / 再玩；无奖励 / 三星 / 排行。
5. 错题：漏击 / 错击对应汉字进 SRS。
6. 横屏 + GameStage + 词包 A2。
7. 60fps；音频与节拍误差 < 50ms。
8. 不调用经济 / 奖励 API。

## Tasks / Subtasks

- [ ] 路由 / GameStage
- [ ] 节拍引擎（Web Audio + RAF 同步）
- [ ] 4 轨道 / 判定线 / 命中检测
- [ ] 谱面数据（JSON，本 story 内置 1 曲）
- [ ] 结算 + SRS
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 多曲目 / 多 BPM / 自定义谱面 → backlog。
- 仅 1 首曲目；版权使用 CC0 资源。

### Project Structure Notes
- `apps/web/src/app/games/hanzi-rhythm/page.tsx`
- `apps/web/src/games/hanzi-rhythm/*`
- `public/games/hanzi-rhythm/track-01.mp3 / chart-01.json`

### References
- [Source: planning/epics/10-games.md#ZY-10-G10]

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

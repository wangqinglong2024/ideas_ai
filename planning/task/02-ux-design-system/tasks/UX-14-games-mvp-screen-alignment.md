# UX-14 · 对齐游戏 MVP 屏幕

## 原文引用

- `planning/ux/09-screens-app.md`：“12 游戏网格。”
- `planning/prds/04-games/01-functional-requirements.md`：“12 张游戏卡片，全部可玩，无 coming_soon 占位。”
- `planning/prds/04-games/01-functional-requirements.md`：“不展示：三星评级 / 排行榜跳转 / 分享按钮 / 奖励动画 / 下一关 / 解锁。”

## 需求落实

- 页面：`/games`、`/games/:game`、`/games/:game/play`、`/games/:game/result`。
- 组件：GameGrid、GameCard、WordPackSelector、GameCanvasShell、GameResultPanel。
- API：GM 模块接入游戏列表、词包、session API。
- 数据表：games/game_sessions/game_user_stats 由 GM 实现。
- 状态逻辑：列表 12 active；结果页只显示用时、得分、错题、再玩、返回。

## 技术假设

- UX 文档中排行榜/奖励属于历史或 post-MVP，不在 W0 C 端展示。

## 不明确 / 风险

- 风险：旧 UX 视觉稿包含排行榜区域。
- 处理：本任务明确删除 MVP 页面中的排行榜/奖励入口，不删除 GM seed 后台联调用假数据。

## 最终验收清单

- [ ] 游戏中心 12 款全部 active。
- [ ] C 端没有 leaderboard/reward/star/next-level UI。
- [ ] 结果页含错题只读展示。
# UX-14 · 对齐游戏 MVP 屏幕

## 原文引用

- `planning/ux/09-screens-app.md`：“12 游戏网格。”
- `planning/prds/04-games/01-functional-requirements.md`：“12 张游戏卡片，全部可玩，无 coming_soon 占位。”
- `planning/prds/04-games/01-functional-requirements.md`：“不展示：三星评级 / 排行榜跳转 / 分享按钮 / 奖励动画 / 下一关 / 解锁。”

## 需求落实

- 页面：`/games`、`/games/:game`、`/games/:game/play`、`/games/:game/result`。
- 组件：GameGrid、GameCard、WordPackSelector、GameCanvasShell、GameResultPanel。
- API：GM 模块接入游戏列表、词包、session API。
- 数据表：games/game_sessions/game_user_stats 由 GM 实现。
- 状态逻辑：列表 12 active；结果页只显示用时、得分、错题、再玩、返回。

## 技术假设

- UX 文档中排行榜/奖励属于历史或 post-MVP，不在 W0 C 端展示。

## 不明确 / 风险

- 风险：旧 UX 视觉稿包含排行榜区域。
- 处理：本任务明确删除 MVP 页面中的排行榜/奖励入口，不删除 GM seed 后台联调用假数据。

## 最终验收清单

- [ ] 游戏中心 12 款全部 active。
- [ ] C 端没有 leaderboard/reward/star/next-level UI。
- [ ] 结果页含错题只读展示。

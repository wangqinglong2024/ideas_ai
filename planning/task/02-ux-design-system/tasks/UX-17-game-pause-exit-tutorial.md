# UX-17 · 实现游戏暂停、退出与首玩教学

## 原文引用

- `planning/ux/10-game-ux.md`：“自动暂停：失去焦点。”
- `planning/ux/10-game-ux.md`：“强制小教学（30s 内）。”

## 需求落实

- 页面：游戏 play 页、pause overlay、exit confirm、tutorial overlay。
- 组件：PauseMenu、ExitConfirm、TutorialOverlay、FocusPauseHandler。
- API：session pause/resume 可由 GM 模块接入。
- 数据表：game_sessions 可记录 paused/ended 状态。
- 状态逻辑：失焦暂停；退出需二次确认；首玩显示短教学。

## 技术假设

- 首玩状态可存在 localStorage 或用户偏好中，GM 模块决定持久化。

## 不明确 / 风险

- 风险：教学超过 30s 打断 60s 回合。
- 处理：教学在正式计时前完成或覆盖暂停状态。

## 最终验收清单

- [ ] 失焦自动暂停。
- [ ] 退出游戏二次确认。
- [ ] 每款游戏首次进入有 30s 内教学。
# UX-17 · 实现游戏暂停、退出与首玩教学

## 原文引用

- `planning/ux/10-game-ux.md`：“自动暂停：失去焦点。”
- `planning/ux/10-game-ux.md`：“强制小教学（30s 内）。”

## 需求落实

- 页面：游戏 play 页、pause overlay、exit confirm、tutorial overlay。
- 组件：PauseMenu、ExitConfirm、TutorialOverlay、FocusPauseHandler。
- API：session pause/resume 可由 GM 模块接入。
- 数据表：game_sessions 可记录 paused/ended 状态。
- 状态逻辑：失焦暂停；退出需二次确认；首玩显示短教学。

## 技术假设

- 首玩状态可存在 localStorage 或用户偏好中，GM 模块决定持久化。

## 不明确 / 风险

- 风险：教学超过 30s 打断 60s 回合。
- 处理：教学在正式计时前完成或覆盖暂停状态。

## 最终验收清单

- [ ] 失焦自动暂停。
- [ ] 退出游戏二次确认。
- [ ] 每款游戏首次进入有 30s 内教学。

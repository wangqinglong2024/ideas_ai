# ZY-09-03 · SceneManager（Loading/Game/GameOver）

> Epic：E09 · 估算：M · 阶段：MVP · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] push / pop / replace API
- [ ] MVP 仅 3 场景：Loading / Game（含 60s 倒计时）/ GameOver（含「再玩一局」按钮）
- [ ] **不**实现 Victory / NextLevel（无关卡）
- [ ] 场景切换淡入淡出 200ms
- [ ] V1 期可补 Pause（不在本 story 范围）

## 测试方法
- 单元：场景栈管理
- demo：Loading→Game→倒计时到 0→GameOver→再玩一局

## DoD
- [ ] 3 场景流畅切换

# ZY-09-06 · AudioManager（Howler）

> Epic：E09 · 估算：M · 阶段：V1 · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] Howler 封装：BGM / SFX / Word audio 三类音量独立
- [ ] 静音 toggle；淡入淡出
- [ ] 同时播放上限 8 通道；溢出复用

## 测试方法
- 单元：音量映射
- demo：BGM + 多 SFX 同时播放

## DoD
- [ ] iOS 自动播放策略适配

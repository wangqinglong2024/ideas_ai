# ZY-09-04 · AssetLoader 基础

> Epic：E09 · 估算：M · 阶段：MVP · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 支持图片 / 音频
- [ ] 进度回调（loaded / total）
- [ ] 失败重试 3 次
- [ ] 内存 cache（避免重复加载）
- [ ] V1 期补 Atlas / BitmapFont

## 测试方法
- 单元：mock 失败请求触发重试
- demo：Loading 场景显示进度

## DoD
- [ ] 进度准确

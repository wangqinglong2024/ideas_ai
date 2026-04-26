# ZY-09-02 · PixiJS Application 封装

> Epic：E09 · 估算：M · 阶段：MVP · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `Application.init({canvas, width, height})`
- [ ] letterbox resize（保持横屏比例）
- [ ] DPR + antialias
- [ ] `destroy()` 清理 ticker / textures / canvas

## 测试方法
- 单元：init / resize / destroy 序列
- demo 页面 60fps

## DoD
- [ ] 多次 init/destroy 无内存泄漏

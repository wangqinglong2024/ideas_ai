# ZY-09-05-V1 · InputManager（触屏 + 摇杆）

> Epic：E09 · 估算：M · 阶段：V1 · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 触屏：tap / drag / swipe / pinch
- [ ] 多指支持
- [ ] 虚拟摇杆组件
- [ ] 设备自动检测（触屏优先 / 桌面键盘 fallback）

## 测试方法
- 单元：手势识别阈值
- MCP Puppeteer 移动模拟：swipe / pinch 事件

## DoD
- [ ] G6-G12 触屏游戏可用

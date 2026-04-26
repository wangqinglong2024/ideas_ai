# ZY-09-09 · 强制横屏 + 全屏 API

> Epic：E09 · 估算：M · 阶段：MVP · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 检测 portrait → 显示「请旋转设备」遮罩
- [ ] iOS 提示手动旋转（无 ScreenOrientation API）
- [ ] Android：尝试 `screen.orientation.lock('landscape')`
- [ ] 全屏 API：进入 / 退出
- [ ] 退出全屏自动暂停游戏

## 测试方法
- MCP Puppeteer：portrait viewport → 显示遮罩
- 真机测：iOS Safari 提示文字

## DoD
- [ ] G1-G12 共用此 hook

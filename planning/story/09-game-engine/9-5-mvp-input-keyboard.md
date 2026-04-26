# ZY-09-05-MVP · InputManager（键盘 + 拼音键盘）

> Epic：E09 · 估算：S · 阶段：MVP · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 键盘 typed/tap 事件
- [ ] 屏幕拼音键盘组件（虚拟键盘 React 组件）
- [ ] 输入回调：`onPinyin(text)` / `onKey(code)`

## 测试方法
- 单元：keydown 触发回调
- MCP Puppeteer：屏幕键盘点击触发

## DoD
- [ ] G1-G5 MVP 可基于此输入

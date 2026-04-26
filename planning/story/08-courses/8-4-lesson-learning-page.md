# ZY-08-04 · 节学习页核心 UI

> Epic：E08 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 顶部进度条 + 步骤切换动画（左→右滑动）
- [ ] 答错反馈：红色高亮 + 正解 + 解释
- [ ] 暂停 / 退出确认弹窗
- [ ] 步骤组件分发器：根据 `step_type` 渲染对应组件

## 测试方法
- MCP Puppeteer：完成 5 个步骤 + 退出确认弹窗
- Storybook：分发器各 type 故事

## DoD
- [ ] 切换流畅 60fps

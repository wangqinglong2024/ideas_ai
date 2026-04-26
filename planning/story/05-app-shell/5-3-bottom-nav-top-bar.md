# ZY-05-03 · 底部导航 + 顶栏

> Epic：E05 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 底部 5 项玻璃态 sticky：玩 / 学 / 发现 / 知语币 / 我
- [ ] 激活态高亮 + indicator 动画
- [ ] iOS 安全区适配（env(safe-area-inset-bottom)）
- [ ] 顶栏：logo / 搜索图标 / 通知 / 知语币入口
- [ ] 切换路由动画 ≤ 200ms

## 测试方法
- Storybook：5 项激活态
- MCP Puppeteer：iPhone 14 viewport 截图

## DoD
- [ ] 跨设备视觉一致

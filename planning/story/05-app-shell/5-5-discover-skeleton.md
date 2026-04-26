# ZY-05-05 · 首屏发现页骨架

> Epic：E05 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] Hero（标语 + 主 CTA）+ 推荐 + 持续学习 + 内容卡片模块
- [ ] 横向滚动模块（snap）
- [ ] 骨架占位 + 错误兜底 + 空状态
- [ ] 模块数据来源 `/api/v1/discover/feed`（聚合接口）
- [ ] LCP ≤ 2.5s（zhiyu-app-fe 容器内 LH 测试）

## 测试方法
- Storybook：各模块 stories
- MCP Puppeteer：首屏截图 + Lighthouse

## DoD
- [ ] LCP 达标
- [ ] 4 语首屏完整

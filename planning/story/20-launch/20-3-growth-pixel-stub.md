# ZY-20-03 · 增长 pixel 占位

> Epic：E20 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 增长
**I want** 预留 Meta Pixel / TikTok Pixel / Google Ads 接入位
**So that** 未来投放可快速接，本期不真实接。

## 上下文
- 仅留 PixelAdapter 接口与 fake 实现：`track('lead'|'signup'|'purchase'|'subscribe')` 写 events 表
- 文档说明真实接入位置（在 PixelAdapter）
- **绝不**直接在 HTML 嵌入第三方 script tag

## Acceptance Criteria
- [ ] PixelAdapter 接口 + Fake
- [ ] 4 关键事件触发位接入
- [ ] 文档 `docs/integrations/pixels.md`

## 测试方法
- MCP Puppeteer 注册 → events 表 `signup` 出现

## DoD
- [ ] 接口可替换

## 依赖
- 上游：ZY-19-03

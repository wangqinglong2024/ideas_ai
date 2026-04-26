# ZY-19-07 · Web Vitals / RUM

> Epic：E19 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** FE 工程师
**I want** 真实用户性能数据（LCP / CLS / INP / FID / TTFB）入库可查
**So that** 持续优化体验。

## 上下文
- 用 web-vitals 库；通过 ZY-19-03 events 上报
- 大盘 p75 / p95 / p99 按页面 / 国家
- 触发回归 → 自动告警

## Acceptance Criteria
- [ ] FE 集成 web-vitals 上报
- [ ] BE 提供 RUM 报表接口
- [ ] admin RUM 页（接 ZY-17-10）
- [ ] 性能预算回归告警

## 测试方法
- MCP Puppeteer 加载首页 → events 表 web_vitals 出现

## DoD
- [ ] 5 指标全采

## 依赖
- 上游：ZY-19-03

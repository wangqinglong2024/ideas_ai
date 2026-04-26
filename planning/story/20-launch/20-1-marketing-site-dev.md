# ZY-20-01 · 营销站（dev 同域）

> Epic：E20 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 营销
**I want** ideas.top 落地页（特性 / 价格 / FAQ / 客户故事 / 注册引导）
**So that** 投放有承接。

## 上下文
- 与 app 同 FE 工程，路由 `/`、`/features`、`/pricing`、`/faq`
- 4 语 + RTL
- 不上 Cloudflare Pages / Vercel；走自家 nginx

## Acceptance Criteria
- [ ] 5 页 SSR/SSG
- [ ] CTA 跳注册 + UTM 透传
- [ ] LCP ≤ 2s（lighthouse）

## 测试方法
- MCP Puppeteer mobile + desktop 分别截图

## DoD
- [ ] lighthouse perf ≥ 90 / a11y ≥ 95

## 依赖
- 上游：ZY-02 / ZY-04 / ZY-05-05

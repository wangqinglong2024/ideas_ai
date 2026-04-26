# ZY-20-01 · 营销站雏形（dev only）

> Epic：E20 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 4 页面 4 语：landing / pricing / courses-intro / about
- [ ] SEO：meta + sitemap.xml + robots.txt + hreflang + OG cards
- [ ] 路由：zhiyu-app-fe 容器内 `/marketing/*`
- [ ] 外网访问 `http://115.159.109.23:3100/marketing/`
- [ ] Lighthouse ≥ 90（dev 容器内跑）

## 测试方法
- MCP Puppeteer：4 语切换 + Lighthouse 报告

## DoD
- [ ] SEO + Lighthouse 达标

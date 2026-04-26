# ZY-18-03 · helmet / CSP / CORS / cookie

> Epic：E18 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 安全负责人
**I want** 标准 HTTP 安全头 + 严格 CSP + CORS allowlist + httpOnly + SameSite cookie
**So that** 防 XSS / clickjack / CSRF。

## 上下文
- helmet middleware on all express apps
- CSP：default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' (tailwind 内联); img-src 'self' data: blob: https:; connect-src 'self' wss://*; frame-ancestors 'none'
- CORS：dev allow ideas.top + admin.ideas.top (按 nginx 配置)
- cookies：__Host- 前缀；Secure；SameSite=Lax (admin) / None (subdomain)

## Acceptance Criteria
- [ ] helmet 配置 + 报告 endpoint
- [ ] CSP 通过浏览器开发者工具验证
- [ ] CORS preflight 测试
- [ ] cookie 属性正确

## 测试方法
- MCP Puppeteer 检查 response headers

## DoD
- [ ] securityheaders.com / observatory 检测期望分

## 依赖
- 上游：ZY-01-04

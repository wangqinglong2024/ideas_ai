# Story 18.3: 安全 HTTP 头（HSTS / CSP / X-Frame / Referrer / Permissions）

Status: ready-for-dev

## Story

作为 **安全工程师**，
我希望 **在所有入口（前端 / API）下发严格的安全 HTTP 头**，
以便 **抵御 XSS / Clickjacking / MIME 嗅探 / 中间人，并通过外部安全评级（securityheaders.com A+）**。

## Acceptance Criteria

1. **HSTS**：`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`（生产）；dev 关闭。
2. **CSP**：严格白名单：
   - `default-src 'self'`
   - `script-src 'self' 'sha256-...' https://*.posthog.com https://challenges.cloudflare.com`
   - `style-src 'self' 'unsafe-inline'`（v1，下个版本移除 unsafe-inline）
   - `img-src 'self' data: blob: https://cdn.zhiyu.io`
   - `media-src 'self' https://cdn.zhiyu.io blob:`
   - `connect-src 'self' https://api.zhiyu.io https://*.posthog.com wss://api.zhiyu.io https://*.sentry.io`
   - `frame-ancestors 'none'`
   - `base-uri 'self'`
   - `form-action 'self'`
   - `report-to csp-endpoint` + `report-uri /api/security/csp-report`
3. **X-Frame-Options**: `DENY`（与 CSP frame-ancestors 双保险）。
4. **X-Content-Type-Options**: `nosniff`。
5. **Referrer-Policy**: `strict-origin-when-cross-origin`。
6. **Permissions-Policy**: 关闭不需要的 API：`camera=(), microphone=(), geolocation=(), payment=()` 等。
7. **CSP 报告端点** `/api/security/csp-report`：接收 violation report 写表 `security_csp_reports`（限流 100/min/IP，避免日志攻击）。
8. **Cookie 属性**：所有 cookie 必须 `Secure`、`HttpOnly`（除非客户端必须读）、`SameSite=Lax|Strict`。
9. **多入口统一**：Cloudflare Pages（前端）+ Worker / API（apps/api）+ Admin domain，三处都正确下发；通过自动化测试验证（curl + 解析）。
10. **A+ 评级**：securityheaders.com 检测达 A+；测试在 CI 中作为 nightly job 验证。
11. **CSP nonce / hash 自动化**：内联 script 必须 build-time hash，禁止运行时计算 unsafe-inline；nonce 用于 SSR（如启用）。

## Tasks / Subtasks

- [ ] **前端 headers**（AC: 1-6, 11）
  - [ ] Cloudflare Pages `_headers` 文件
  - [ ] CSP hash 自动注入（vite plugin）
- [ ] **API headers**（AC: 1-6）
  - [ ] middleware in `apps/api`
- [ ] **Admin headers**（AC: 1-6）
- [ ] **CSP 报告端点**（AC: 7）
  - [ ] table + handler + 限流
- [ ] **Cookie 检查**（AC: 8）
  - [ ] CI 测试断言 cookie 属性
- [ ] **CI 验证**（AC: 9, 10）
  - [ ] securityheaders.com nightly check（GitHub Action）

## Dev Notes

### 关键约束
- CSP `unsafe-inline` 临时存在仅因 tailwind v4 动态样式策略，PR 中标 TODO，v1.5 通过 nonce 移除。
- `report-to` group：必须配 `Report-To` header 与 endpoint 一致。
- WebSocket：CSP `connect-src` 必须含 wss URL。
- Stripe/Paddle iframe：如使用 hosted checkout，需要 `frame-src https://*.paddle.com`，由 13-x 单独追加。
- securityheaders A+ 要求所有上述头存在 + CSP 严格。

### 关联后续 stories
- 18-1（cookie attrs 协调）
- 18-9 WAF
- 13-x（追加 frame-src for payment）

### Project Structure Notes
- `apps/web/public/_headers`
- `apps/admin/public/_headers`
- `apps/api/src/middleware/security-headers.ts`
- `apps/api/src/routes/security/csp-report.ts`
- `packages/db/schema/security.ts` (csp_reports)
- `.github/workflows/security-headers-check.yml`

### References
- `planning/epics/18-security.md` ZY-18-03
- `planning/spec/09-security.md` § 6

### 测试标准
- e2e curl 验证三入口头
- securityheaders.com A+
- CSP report 接收 + 限流

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

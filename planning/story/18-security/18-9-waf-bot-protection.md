# Story 18.9: WAF + Bot 防护（Cloudflare / Turnstile）

Status: ready-for-dev

## Story

作为 **安全工程师**，
我希望 **配置 Cloudflare WAF 规则 + Turnstile 人机验证 + 异常 IP 封禁**，
以便 **拦截扫描器、暴力破解、薅羊毛与基础 DDoS**。

## Acceptance Criteria

1. **Cloudflare WAF rules**：
   - 阻断常见 SQLi / XSS payload（OWASP Core Rule Set，Cloudflare Managed）。
   - 阻断已知恶意 UA（cmix bot / crawler 黑名单）。
   - 限制每 IP 5min 内 4xx 比例 > 50% 的客户端（CF rate limiting + challenge）。
2. **Turnstile**：注册 / 重置密码 / 联系客服 / 评论端点必接入；后端校验 token 通过 Cloudflare API。
3. **异常 IP 封禁**：自动规则
   - 1h 内 5 次登录失败 → challenge 1h；
   - 10 次 → 封禁 24h；
   - 24h 内多账户登录失败 > 50 → 封禁 7d。
4. **国家级策略**：默认放行 4 国（CN/VN/TH/ID）+ 主要欧美；其它国家访问 admin 后台 challenge。
5. **后台 IP 白名单**（管理 admin.zhiyu.io）：限制公司办公 IP / VPN；外部访问 challenge。
6. **日志**：WAF 命中 / Turnstile 失败 / IP 封禁全部上报 PostHog + 写 `security_events`。
7. **白名单 / 误杀响应**：自助申诉端点 `/api/security/appeal` + 后台 17-x 处理面板。
8. **配置即代码**：Cloudflare 规则 Terraform 管理（`infra/cloudflare/`），PR 即变更。
9. **演练**：每月一次模拟扫描（OWASP ZAP / Burp）验证规则有效。
10. e2e 测试 + WAF 规则 dry-run 模式。

## Tasks / Subtasks

- [ ] **Terraform Cloudflare 规则**（AC: 1, 4, 5, 8）
- [ ] **Turnstile 集成**（AC: 2）
  - [ ] React widget + 后端 verify
- [ ] **异常 IP 自动规则**（AC: 3）
  - [ ] worker / firewall rules
- [ ] **日志 + 申诉**（AC: 6, 7）
- [ ] **演练流程**（AC: 9）
- [ ] **测试**（AC: 10）

## Dev Notes

### 关键约束
- Turnstile 失败必须前端可见提示 + 重试；后端 verify 失败返回 403，不暴露内部原因。
- 异常 IP 自动规则不可单纯依赖 IP（NAT / VPN 误杀），结合 device_id 双键。
- 国家级 challenge：避免 hard block 普通用户，使用 challenge / managed challenge。
- Terraform 状态存 R2 backend；变更走 PR + plan review。
- 演练后产生 ZAP 报告归档 R2 /security/zap-runs/。

### 关联后续 stories
- 18-2 rate limit（应用层互补）
- 18-3 安全头
- 17-x admin 申诉处理

### Project Structure Notes
- `infra/cloudflare/` (Terraform)
- `apps/api/src/middleware/turnstile.ts`
- `apps/web/src/components/Turnstile.tsx`
- `apps/api/src/routes/security/appeal.ts`
- `packages/db/schema/security.ts` (security_events)

### References
- `planning/epics/18-security.md` ZY-18-09

### 测试标准
- e2e：Turnstile 失败 → 注册阻断
- 规则：模拟暴力 → 自动 ban
- 演练：月度 ZAP 报告归档

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

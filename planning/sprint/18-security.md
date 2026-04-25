# Sprint S18 · 安全与合规（Security & Compliance）

> Epic：[E18](../epics/18-security.md) · 阶段：M0-M6 贯穿 · 优先级：P0 · 估算：5 周分散
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-18)

## Sprint 目标
OWASP Top 10、加密、合规（GDPR / PDPA）、风控、隐私政策、漏洞响应。

## Story 列表与阶段绑定

| 序 | Story Key | 估 | 阶段 |
|:-:|---|:-:|:-:|
| 1 | 18-1-password-token-baseline | M | M0（W3）|
| 2 | 18-2-input-validation-rate-limit | M | M0（W4）|
| 3 | 18-3-security-http-headers | M | M0（W4）|
| 4 | 18-8-vuln-scanning-deps | M | M0（W4）|
| 5 | 18-4-data-encryption | M | M1（W7）|
| 6 | 18-9-waf-bot-protection | M | M1（W8）|
| 7 | 18-6-privacy-tos | M | M2（W12）|
| 8 | 18-7-data-export-delete-gdpr | L | M2（W13-W14，配合 S03）|
| 9 | 18-5-audit-logs | M | M3（W15-W16，配合 S17）|
| 10 | 18-10-incident-response | M | M6（W36-W37）|

## 风险
- 跨国合规复杂 → 律师 + 分国处理
- 单点故障泄露 → 多层防护（WAF + Rate Limit + Input Validation + Encryption + Audit）

## DoD
- [ ] OWASP Top 10 验证通过（手动 + 自动）
- [ ] 渗透测试报告（M6 末，外部团队）
- [ ] 合规文件 4+1 语完整
- [ ] CodeQL + Renovate / Dependabot 启用
- [ ] CSP 严格白名单 + 报告端点
- [ ] retrospective 完成

# Story Index · E18 安全与合规

> 顶层约束：[planning/00-rules.md](../../00-rules.md)。Story 数量按需 8。**WAF / Bot 防护**走 nginx + RLS + express-rate-limit；**不**接 Cloudflare / Turnstile / Recaptcha。

| ID | 标题 | 估 | 状态 |
|---|---|---|---|
| [ZY-18-01](./18-1-password-token-baseline.md) | 密码 / Token 安全基线 | M | ready-for-dev |
| [ZY-18-02](./18-2-input-validation-ratelimit.md) | API 输入校验 + Rate Limit | M | ready-for-dev |
| [ZY-18-03](./18-3-helmet-csp.md) | 安全 HTTP 头（helmet） | M | ready-for-dev |
| [ZY-18-04](./18-4-encryption-audit.md) | 数据加密 + 审计日志 | M | ready-for-dev |
| [ZY-18-05](./18-5-privacy-tos.md) | 隐私政策 + TOS（4+1 语） | M | ready-for-dev |
| [ZY-18-06](./18-6-data-export-delete.md) | 数据下载 + 删除（GDPR） | L | ready-for-dev |
| [ZY-18-07](./18-7-vuln-scan-deps.md) | 漏洞扫描 + 依赖管理 | M | ready-for-dev |
| [ZY-18-08](./18-8-waf-substitute-incident.md) | WAF 替代 + 风控 + 事件响应 | M | ready-for-dev |

Epic：[../../epics/18-security.md](../../epics/18-security.md)

# Story Index · E18 安全与合规（Security & Compliance）

> Epic：[E18](../../epics/18-security.md) · Sprint：[S18](../../sprint/18-security.md)
> 阶段：M0-M6 贯穿 · 优先级：P0 · 估算：5 周（分散）
> Story 数：10

## Story 列表与阶段绑定

| 序 | Story Key | 标题 | 估 | 阶段 |
|:-:|---|---|:-:|:-:|
| 1 | [18-1-password-token-baseline](./18-1-password-token-baseline.md) | 密码 / Token 安全基线 | M | M0（W3） |
| 2 | [18-2-input-validation-rate-limit](./18-2-input-validation-rate-limit.md) | API 输入校验 + Rate Limit | M | M0（W4） |
| 3 | [18-3-security-http-headers](./18-3-security-http-headers.md) | 安全 HTTP 头 | M | M0（W4） |
| 4 | [18-8-vuln-scanning-deps](./18-8-vuln-scanning-deps.md) | 漏洞扫描 + 依赖管理 | M | M0（W4） |
| 5 | [18-4-data-encryption](./18-4-data-encryption.md) | 数据加密 | M | M1（W7） |
| 6 | [18-9-waf-bot-protection](./18-9-waf-bot-protection.md) | WAF + Bot 防护 | M | M1（W8） |
| 7 | [18-6-privacy-tos](./18-6-privacy-tos.md) | 隐私政策 + TOS（4+1 语） | M | M2（W12） |
| 8 | [18-7-data-export-delete-gdpr](./18-7-data-export-delete-gdpr.md) | 数据下载 + 删除（GDPR） | L | M2（W13-W14） |
| 9 | [18-5-audit-logs](./18-5-audit-logs.md) | 审计日志 | M | M3（W15-W16） |
| 10 | [18-10-incident-response](./18-10-incident-response.md) | 事件响应流程 | M | M6（W36-W37） |

## DoD
- OWASP Top 10 验证通过（手动 + 自动）
- 渗透测试报告（M6 末，外部团队）
- 合规文件 4+1 语完整
- CodeQL + Renovate / Dependabot 启用
- CSP 严格白名单 + 报告端点
- retrospective 完成

## 关键依赖
- E01：CI / CD 已就绪
- E03：用户账号（GDPR 数据所有权）
- E17：admin 后台（审计日志写入入口）

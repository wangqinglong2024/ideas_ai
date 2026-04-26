# Sprint S18 · 安全与合规

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/18-security.md](../epics/18-security.md) · 阶段：M0-M6 横切 · 优先级：P0
> Story 数：8 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
横切 8 项：密码 / token 基线；输入校验 + 限流；helmet/CSP/CORS/cookie；加密 + 审计；隐私 / TOS；GDPR 导出 / 删除；漏洞扫描；WAF 替代 + 应急剧本。

## 排期（贯穿全阶段）
| 周 | Story | 验收 |
|---|---|---|
| W3-4 | ZY-18-01 password+token | argon2id + refresh rotate |
| W4-5 | ZY-18-02 zod+ratelimit | 4 默认策略 + ±5% 准确 |
| W5 | ZY-18-03 helmet+CSP | observatory 评分达标 |
| W6-7 | ZY-18-04 encryption+audit | 加密往返 + 审计入库 |
| W7-8 | ZY-18-05 privacy+tos | 4 语同意条 + 版本 re-prompt |
| W17-18 | ZY-18-06 export+delete | zip 完整 + 30d 真删 |
| W22 | ZY-18-07 vuln scan | 报告 + 高危开 ticket |
| W23 | ZY-18-08 WAF+runbook | nginx + fail2ban + 4 runbook |

## 依赖与并行
- 与所有 sprint 并行
- 上线前必须全绿

## 退出标准
- securityheaders 期望分
- GDPR 路径全测
- 4 runbook 演练记录留档

## 风险
- 加密 key 管理：env + 备份策略
- 限流误伤：白名单 + 监控

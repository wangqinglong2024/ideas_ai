# ZY-18-08 · WAF 替代 + 风控 + 事件响应

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] zhiyu-internal nginx 容器配置：UA 黑名单 / 已知坏路径 → 404 / 简单 IP 限速
- [ ] 异常 IP 自动写 `zhiyu.blocked_ips` 表
- [ ] BE 启动时加载并周期性 reload（5 分钟）
- [ ] runbook md：事件响应步骤
- [ ] 演练 1 次（命令手册输出）

## 测试方法
- 集成：mock 坏路径 → 404
- 黑名单 IP 请求 → 403

## DoD
- [ ] 替代 WAF 基线；不引用 Cloudflare / Turnstile / Recaptcha

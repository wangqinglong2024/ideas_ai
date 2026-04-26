# ZY-18-03 · 安全 HTTP 头（helmet）

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] helmet middleware：CSP / X-Frame / Referrer / Permissions
- [ ] HSTS：dev 关闭、prod 由用户 nginx 处理
- [ ] CSP 严格白名单（self + supabase host）
- [ ] CSP report endpoint：`/api/v1/_csp-report` 写 `error_events`

## 测试方法
- 集成：响应头 `content-security-policy` 存在
- 触发违规 → report 端点收到

## DoD
- [ ] CSP 白名单与白屏率指标 dev 内验证

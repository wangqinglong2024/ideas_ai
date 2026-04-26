# ZY-17-02 · 后台登录 + TOTP

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 走 supabase auth signInWithPassword
- [ ] 二次因素：TOTP（otpauth + qrcode 自渲染，无第三方 SDK）
- [ ] 失败 5 次锁定 15 分钟
- [ ] 设备记忆 30d（HttpOnly cookie）

## 测试方法
- MCP Puppeteer：邮箱+密码 → TOTP → 进入后台

## DoD
- [ ] 二因素 + 锁定 OK

# ZY-03-02 · 注册 + 邮箱验证（Supabase Auth）

> Epic：E03 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] FE 调 `supabase.auth.signUp({ email, password })`
- [ ] 验证邮件由 supabase Auth 内置模板触发；本地由 supabase Studio 取 token
- [ ] 注册前置 Captcha：`CaptchaAdapter.verify`，缺 key 时 fake 通过
- [ ] 注册成功 → 路由 `/auth/check-email`
- [ ] 重复邮箱、弱密码错误码 i18n

## 测试方法
- MCP Puppeteer：注册 → 在 supabase Studio 复制 confirm 链接 → 完成验证 → 自动跳到首页
- 单元：表单 schema（zod）边界

## DoD
- [ ] 流程在 zhiyu-app-fe 容器内通
- [ ] 不直接调 Resend/Sendgrid

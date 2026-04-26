# ZY-03-03 · 登录 / OAuth / 找回密码

> Epic：E03 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 邮箱+密码登录 走 `supabase.auth.signInWithPassword`
- [ ] OAuth：Google / Apple；缺 provider key 时 FE 隐藏对应按钮，BE 日志 WARN
- [ ] 找回密码 走 `supabase.auth.resetPasswordForEmail`
- [ ] BE 中间件：`supabaseAuthGuard`（验证 JWT，解出 user_id 注入 req.user）
- [ ] 失败 5 次锁定 5 分钟（依 IP+email 双键，redis 计数）

## 测试方法
- MCP Puppeteer：登录成功 / 失败 / 锁定 / 解锁
- 缺 OAuth key：按钮不渲染（验证 DOM）

## DoD
- [ ] 三路径全跑通
- [ ] 错误信息 i18n 完整

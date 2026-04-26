# ZY-18-01 · 密码 / Token 安全基线

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] supabase auth：bcrypt + 强密码策略（≥10 位 / 含大小写数字 / 字典黑名单）
- [ ] JWT 过期 ≤ 1h；refresh 黑名单（BE 维护 `revoked_tokens` 表）
- [ ] 登出 → revoke 当前 refresh
- [ ] 异常设备登录 → 邮件通知（EmailAdapter fake）

## 测试方法
- 单元：弱密码拒绝
- 集成：revoke 后旧 refresh 401

## DoD
- [ ] 强策略生效

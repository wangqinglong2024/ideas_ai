# AD-03 · 实现后台登录与强制 2FA

## PRD 原文引用

- `AD-FR-001`：“邮箱 + 密码 + TOTP（强制 2FA）。”
- `AD-FR-001`：“失败 5 次锁 30min；IP 白名单（可选）。”

## 需求落实

- 页面：`/admin/login`、TOTP 验证页。
- 组件：AdminLoginForm、TotpChallengeForm。
- API：`POST /admin/api/auth/login`、`POST /admin/api/auth/totp/verify`。
- 数据表：`admin_users`、`admin_audit_logs`、可选 login_attempts。
- 状态逻辑：失败 5 次锁 30min；TOTP 未通过不发后台 session。

## 不明确 / 风险

- 风险：UX 文件写 15min 锁定，PRD 写 30min。
- 处理：以 PRD `AD-FR-001` 的 30min 为准。

## 技术假设

- TOTP secret 加密存储。

## 最终验收清单

- [ ] 管理员登录必须通过 TOTP。
- [ ] 失败 5 次锁 30min。
- [ ] IP 白名单开启时非白名单拒绝。
- [ ] 登录成功/失败写审计或安全日志。
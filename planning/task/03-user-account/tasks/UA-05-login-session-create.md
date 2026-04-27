# UA-05 · 登录与会话创建

## PRD 原文引用

- `UA-FR-004`：“邮箱 + 密码 或 Google。”
- `UA-FR-004`：“失败 5 次锁 15min（锁定 IP + 邮箱）。”
- `UA-FR-004`：“记住设备：30 天。”

## 需求落实

- 页面：`/auth/login`。
- 组件：LoginForm、PasswordInput、OAuthButton、RememberDeviceCheckbox、LockoutNotice。
- API：`POST /api/auth/login`、`POST /api/auth/oauth/google`。
- 数据表：`user_sessions`、`user_devices`、`security_events`。
- 状态逻辑：失败计数按 IP+邮箱；达到 5 次锁定 15min；成功创建 session 与设备记录。

## 技术假设

- Cookie 使用 HttpOnly/Secure/SameSite=Lax。
- 记住设备通过 refresh token 有效期或设备信任标记实现。

## 不明确 / 风险

- 风险：dev HTTP 下 secure cookie 调试困难。
- 处理：dev 允许本地域配置，但部署口径保留 secure。

## 最终验收清单

- [ ] 正确账号可登录。
- [ ] 连续失败 5 次锁定。
- [ ] 设备信息写入 user_devices。

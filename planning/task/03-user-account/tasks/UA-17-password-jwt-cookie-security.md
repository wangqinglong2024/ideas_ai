# UA-17 · 密码、JWT 与 Cookie 安全

## PRD 原文引用

- `planning/prds/06-user-account/01-functional-requirements.md`：“密码哈希 bcrypt rounds=12。”
- 同文件：“session token：HttpOnly / Secure / SameSite=Lax。”
- `planning/prds/06-user-account/02-data-model-api.md`：“JWT HS256（access 15min / refresh 7 天 / max 30 天）。”

## 需求落实

- 页面：无直接页面；登录状态影响全站。
- 组件：auth middleware、cookie helper、password service。
- API：login、refresh、logout、password change/reset。
- 数据表：`user_sessions` 存 refresh_token_hash。
- 状态逻辑：access 15min；refresh 7d；记住设备 max 30d；logout revoke。

## 技术假设

- 若 Supabase Auth 使用自带 token，仍需在知语层对 session 管理需求做映射。

## 不明确 / 风险

- 风险：PRD 有 JWT HS256，Supabase Auth 默认可能 RS256/JWKS。
- 处理：不私自改 Auth 底座；实现时写明映射，以 Supabase 配置为准但满足时效和 Cookie 要求。

## 最终验收清单

- [ ] 密码 bcrypt cost=12。
- [ ] Cookie HttpOnly/SameSite=Lax。
- [ ] refresh token 只存 hash。

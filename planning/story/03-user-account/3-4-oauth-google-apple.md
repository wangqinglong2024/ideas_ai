# Story 3.4: OAuth Google + Apple

Status: ready-for-dev

## Story

As a 用户,
I want 用 Google 或 Apple 一键登录,
so that 不必记住额外密码，并能与已有邮箱账号自动绑定。

## Acceptance Criteria

1. `GET /v1/auth/oauth/google?redirect=...` 与 `GET /v1/auth/oauth/apple?...` 重定向到 OAuth 授权。
2. 回调端点 `/v1/auth/oauth/google/callback` 与 `/apple/callback` 处理 code → token → userinfo。
3. 首次绑定：在 `oauth_accounts` 插入；若 email 与已有 users.email 匹配 → 自动绑定到现有用户（合并）。
4. 全新用户：自动创建 `users` 行，`email_verified_at = now()`（OAuth provider 已校验邮箱）。
5. **Apple Privacy Email**（`@privaterelay.appleid.com`）支持：识别 + 标记 `users.is_private_email = true`；不提示"邮箱已被使用"。
6. 颁发 access + refresh token，复用 3-3 逻辑；前端通过 query/fragment 拿到 token 存储。
7. CSRF 防护：state 参数随机值 + Redis 短 TTL（10 分钟）校验。
8. PKCE：Google 与 Apple 全部启用 code_verifier / code_challenge S256。
9. 错误回退：用户拒绝授权 / 网络错 → 跳回 `/login?oauth_error=...` 显示友好提示。
10. 配置走 Doppler：`GOOGLE_CLIENT_ID/SECRET`、`APPLE_TEAM_ID/CLIENT_ID/KEY_ID/PRIVATE_KEY`。
11. 测试：成功 / state mismatch / PKCE fail / 已绑定他人邮箱（拒绝）/ Apple Private Email。

## Tasks / Subtasks

- [ ] Task 1: OAuth 通用框架（AC: #7, #8）
  - [ ] `lib/oauth.ts` 抽象 provider
  - [ ] state + PKCE Redis store
- [ ] Task 2: Google 实现（AC: #1, #2, #3, #4）
- [ ] Task 3: Apple 实现 + Private Email（AC: #5）
  - [ ] Apple JWT client_secret 生成（ES256 with key id）
- [ ] Task 4: 账号合并 / 创建逻辑（AC: #3, #4）
- [ ] Task 5: 错误回退（AC: #9）
- [ ] Task 6: 测试（AC: #11）

## Dev Notes

### 关键约束
- Apple client_secret 需用 ES256 自签 JWT（10 分钟 TTL，缓存）
- Google id_token 必须验证 audience + issuer
- 合并策略冲突：同邮箱已被密码注册 → 直接绑定 oauth_account（不要求二次验证 v1）

### 依赖链
- 依赖：3-1, 3-3
- 被依赖：3-10

### Project Structure Notes
```
apps/api/src/
  routes/auth/oauth/
    google.ts
    google-callback.ts
    apple.ts
    apple-callback.ts
  lib/oauth/{state,pkce,apple-jwt,google-verify}.ts
```

### Security
- OWASP A01 / A07
- Apple key 文件 PEM 存 Doppler base64

### References
- [Source: planning/epics/03-user-account.md#ZY-03-04](../../epics/03-user-account.md)
- [Source: planning/spec/07-integrations.md#2-OAuth](../../spec/07-integrations.md)
- [Source: planning/spec/09-security.md](../../spec/09-security.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

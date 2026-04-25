# Story 3.3: 登录 API + JWT + 锁定

Status: ready-for-dev

## Story

As a 注册用户,
I want 用邮箱 + 密码登录，获得 access + refresh token，并在 5 次失败后账号短暂锁定 + 异常登录邮件提醒,
so that 体验顺畅且能抵御暴力破解。

## Acceptance Criteria

1. `POST /v1/auth/login { email, password, device_label? }` 返回 `{ access_token, refresh_token, expires_in, user }`。
2. **access token**：JWT (RS256)，**有效期 15 分钟**；payload 含 `sub / email_verified / iat / exp / jti`。
3. **refresh token**：256-bit 随机 → SHA-256 hash 存 Redis `refresh:{user_id}:{jti}`，TTL 30 天；同时插入 `sessions` 行。
4. 失败 5 次（按 `email + ip`）→ 锁该 email 15 分钟（Redis 计数）；锁定期返回 429 + `Retry-After`。
5. 未验证邮箱（`email_verified_at = null`）→ 拒绝登录 + 提示重发验证邮件。
6. 异常登录检测：新设备 / 新 IP 段 / 新国家 → Resend 发"异常登录"邮件，含 IP / UA / 时间，并提供"非本人操作 → 修改密码"链接。
7. `POST /v1/auth/refresh { refresh_token }` 校验 hash → 颁发新 access；refresh 不轮换（v1）；7 天前必须本机刷新一次防止过期。
8. `POST /v1/auth/logout { refresh_token }` 删除 Redis key + 删 sessions 行。
9. 限流：同 IP 登录 10 分钟 ≤ 20 次；同 email 1 分钟 ≤ 6 次（Redis）。
10. 测试：正常登录 / 错密码 / 锁定 / 未验证 / refresh / logout / 异常登录邮件触发。

## Tasks / Subtasks

- [ ] Task 1: JWT 工具（AC: #2, #7）
  - [ ] `lib/jwt.ts` RS256 签发 / 验证；私钥从 Doppler
- [ ] Task 2: 登录路由 + 失败计数（AC: #1, #4, #5）
- [ ] Task 3: refresh token Redis 存储（AC: #3）
  - [ ] sessions 行同步插入
- [ ] Task 4: 异常登录检测（AC: #6）
  - [ ] IP geolocate（Cloudflare CF-IPCountry header）
  - [ ] 上次登录 country / device 比对
  - [ ] Resend 邮件
- [ ] Task 5: refresh / logout（AC: #7, #8）
- [ ] Task 6: 限流（AC: #9）
- [ ] Task 7: 测试（AC: #10）

## Dev Notes

### 关键约束
- RS256 私钥不入仓库；Doppler `JWT_PRIVATE_KEY` / 公钥静态 build 进 SDK
- refresh token 存 hash（sha256）而非明文
- 不轮换 refresh：简化但需配合 `sessions.expires_at` 监控；v1.5 可加轮换
- 锁定计数 key：`login_fail:{email_hash}:{ip}` Sliding window

### 依赖链
- 依赖：3-1, 3-2, S01 1-11 Redis
- 被依赖：3-4 / 3-5 / 3-6 / 3-8 / 3-10

### Project Structure Notes
```
apps/api/src/
  routes/auth/{login,refresh,logout}.ts
  lib/{jwt,auth-context,geo}.ts
  email/templates/abnormal-login.{lang}.tsx
```

### Security
- OWASP A07（broken auth）
- JWT key rotation 计划在 v1.5

### References
- [Source: planning/epics/03-user-account.md#ZY-03-03](../../epics/03-user-account.md)
- [Source: planning/spec/04-backend.md#3-Auth](../../spec/04-backend.md)
- [Source: planning/spec/09-security.md](../../spec/09-security.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

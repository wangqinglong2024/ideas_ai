# Story 17.2: 后台登录 + TOTP（含失败锁定 + 设备记忆）

Status: ready-for-dev

## Story

作为 **后台管理员**，
我希望 **使用邮箱 + 密码 + TOTP 双因素登录后台**，
以便 **保证后台访问安全，并在受信设备 30 天内免 TOTP**。

## Acceptance Criteria

1. 路由 `POST /api/admin/auth/login`：入参 `{ email, password }`，返回 `{ login_token, requires_totp: true }`（一次性 token 5 分钟内提交 TOTP）。
2. `POST /api/admin/auth/totp/verify`：入参 `{ login_token, code, remember_device?: bool }`；成功返回 admin JWT（短期 30min）+ refresh（7d）+ 可选 `device_token`（30d）。
3. **TOTP 注册**：首次登录强制注册流程 `/admin/auth/totp/enroll`；返回 otpauth URL + base64 二维码（前端渲染）；用户输入 6 位码确认后写 `totp_secret_enc` + `totp_enrolled_at`。
4. **失败锁定**：连续失败 5 次（密码或 TOTP）→ `locked_until = now + 15min`；锁定期间登录直接 423 Locked。
5. **设备记忆**：`device_token` = sha256(random32 + admin_id)；存表 `admin_devices`（id / admin_id / token_hash / ua / ip / expires_at），下次登录携带 → 跳过 TOTP（仍要密码）。
6. **JWT**：HS256，payload 含 `sub`（admin_id）、`roles[]`、`permissions[]`（缓存自数据库 5min，权限变更通过踢出会话强制刷新）、`iat`、`exp`。
7. **审计日志**：登录成功 / 失败 / TOTP 失败 / 锁定 / 注册 TOTP 全部写 audit_logs。
8. **限速**：login 端点 5/min/IP + 5/min/email；TOTP 端点 10/min/login_token。
9. **CSRF / Cookie**：admin JWT 通过 httpOnly secure SameSite=Strict cookie 下发，禁止 localStorage。
10. **找回 / 重置**：超管在 17-5 / 17-12 提供"重置 TOTP"操作；不暴露给端用户自服务（避免社工）。
11. 单元 + 集成 + e2e：完整登录 / 锁定 / 设备记忆 / TOTP 错误。

## Tasks / Subtasks

- [ ] **API 路由**（AC: 1-3, 6）
  - [ ] `apps/api/src/routes/admin/auth.ts`
  - [ ] otpauth + qrcode 生成（speakeasy）
- [ ] **失败锁定**（AC: 4）
  - [ ] failed_login_count + locked_until 原子更新
- [ ] **设备记忆**（AC: 5）
  - [ ] admin_devices 表
- [ ] **限速 + Cookie + CSRF**（AC: 8, 9）
- [ ] **审计**（AC: 7）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- TOTP 验证必须接受 ±1 步漂移（30s 窗口前后），避免时间不同步问题。
- login_token 一次性，TOTP 验证或过期即失效；存 Redis（key: login_token, ttl 5min）。
- device_token cookie 与 admin JWT cookie 分开；device_token 跨域受限；JWT 仅 admin 域。
- 强密码策略由 18-1 实现（≥12 字符 + 复杂度），17-2 仅检查策略 hook。
- 锁定期间端点返回 423 + Retry-After header。

### 关联后续 stories
- 17-1（schema）
- 17-3 RBAC 中间件
- 18-1 密码策略 / 18-3 安全 HTTP 头 / 18-5 audit
- 17-5 用户管理：reset_totp 操作

### Project Structure Notes
- `apps/api/src/routes/admin/auth.ts`
- `packages/db/schema/admin.ts`（admin_devices）
- `packages/auth/src/admin-jwt.ts`
- `packages/auth/src/totp.ts`

### References
- `planning/epics/17-admin.md` ZY-17-02
- `planning/spec/09-security.md` § 2.2

### 测试标准
- e2e Playwright：登录 + TOTP + remember device → 30d 内免 TOTP
- 锁定：连续失败 5 → 423
- 限速：login 6 次内有 1 次 429

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

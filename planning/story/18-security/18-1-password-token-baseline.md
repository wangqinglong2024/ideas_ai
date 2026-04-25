# Story 18.1: 密码 / Token 安全基线

Status: ready-for-dev

## Story

作为 **后端 / 安全工程师**，
我希望 **建立密码哈希、JWT 签发、Refresh 黑名单的统一安全基线**，
以便 **杜绝弱密码 / token 泄露 / 重放攻击，作为所有用户与 admin 鉴权 stories 的共用基础**。

## Acceptance Criteria

1. **密码哈希**：bcrypt cost=12（生产）/ 4（测试），统一封装在 `packages/auth/src/password.ts`：`hashPassword`、`verifyPassword`。
2. **强密码策略**：
   - 长度 ≥ 12；
   - 至少 3 类（大写 / 小写 / 数字 / 符号）；
   - 不在 [zxcvbn ≤ 2] 与公开泄露表（HIBP local 200k 列表）中；
   - 不能与 email / username 高度相似（编辑距离 ≤ 3 拒绝）。
3. **校验函数** `isStrongPassword(pw, ctx)` 返回 `{ ok, reasons[] }`，所有注册 / 修改密码端点必须调用。
4. **JWT 签发**：
   - access：HS256（共享密钥 doppler）/ 或 RS256（KMS 公私钥）二选一；本 story 默认 HS256，文档说明 v1.5 升级路径。
   - 端用户 access TTL 30min；admin TTL 30min。
   - refresh TTL 30d（端用户）/ 7d（admin）。
   - payload：`sub` / `roles` / `jti`（uuid v7）/ `iat` / `exp`。
5. **Refresh 黑名单**：登出 / 改密 / 强制下线时 jti 写 Redis 黑名单（TTL = remain seconds），中间件校验。
6. **Token 旋转**：refresh 一次性使用，使用后立即作废 + 颁发新对 access/refresh；旧 refresh 试图重用 → 全部 sessions 强制下线（疑似泄露）。
7. **Cookie 模式**：admin 后台使用 httpOnly secure SameSite=Strict cookie；端用户 SPA 默认 Bearer header（PWA 支持），可选 cookie 模式（feature flag）。
8. **失败计数**：登录失败 5 次锁 15min（与 17-2 一致）；解锁仅靠时间或 admin 重置。
9. **密钥管理**：所有密钥 doppler 注入；本地 dev `.env.example` 提供占位；CI 提供 dummy。
10. **测试覆盖**：bcrypt verify、强密码所有失败分支、refresh 旋转、黑名单命中、过期检查。

## Tasks / Subtasks

- [ ] **password 模块**（AC: 1-3）
  - [ ] bcrypt + zxcvbn + HIBP local
- [ ] **JWT 模块**（AC: 4-7）
  - [ ] sign / verify
  - [ ] refresh 旋转 + 黑名单
  - [ ] cookie / header 双模
- [ ] **失败计数中间件**（AC: 8）
- [ ] **密钥配置**（AC: 9）
- [ ] **测试**（AC: 10）

## Dev Notes

### 关键约束
- bcrypt cost=12 在 M+1 评估硬件后可能调到 13，调整需 PR + 用户登录时透明 rehash。
- HIBP local：使用 SHA-1 prefix 200k 列表（packages/security/data/hibp-top.txt），不联网调用以避免泄露密码 hash。
- refresh 旋转：使用 family 概念（family_id + generation），重用旧 refresh → 整 family 失效（OAuth refresh token rotation 标准）。
- jti Redis 黑名单 key：`jwt:revoked:{jti}`，TTL = exp - now。
- 不允许在日志 / Sentry breadcrumb 中出现明文密码 / token / refresh / cookie 值；过滤器 by 字段名。

### 关联后续 stories
- 17-2 admin login（直接消费）
- E03 user-account（注册 / 登录）
- 18-3 安全头（cookie attrs）
- 18-5 audit（登录事件）

### Project Structure Notes
- `packages/auth/src/password.ts`
- `packages/auth/src/jwt.ts`
- `packages/auth/src/refresh-rotation.ts`
- `packages/security/data/hibp-top.txt`

### References
- `planning/epics/18-security.md` ZY-18-01
- `planning/spec/09-security.md` § 2

### 测试标准
- 单元：所有强密码分支
- 集成：refresh 旋转 + family 失效
- 安全：日志过滤密钥字段

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

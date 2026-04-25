# Story 17.1: admin_users / roles / permissions 表

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立 admin_users / roles / permissions / role_permissions / user_roles 5 张表**，
以便 **后续登录、RBAC 中间件、UI 权限校验有完整的权限基座，并种入超管账号**。

## Acceptance Criteria

1. Drizzle schema：
   - `admin_users`：id uuid v7 / email unique / password_hash / totp_secret_enc / totp_enrolled_at / status enum 'active'|'disabled'|'locked' / last_login_at / failed_login_count / locked_until / created_at / updated_at
   - `roles`：id / key unique / name / description / created_at
   - `permissions`：id / key unique（点分式如 `factory:write`）/ description
   - `role_permissions`：role_id / permission_id（PK 复合）
   - `admin_user_roles`：admin_user_id / role_id（PK 复合）
2. 默认 roles 种子：`super_admin` / `content_editor` / `cs_agent` / `finance` / `analyst` / `developer`。
3. 默认 permissions 种子：覆盖 `users:*`、`articles:*`、`courses:*`、`novels:*`、`wordpacks:*`、`games:*`、`orders:*`、`refunds:*`、`referral:read`、`cs:*`、`factory:*`、`flags:*`、`reports:*`、`audit:read`。
4. 种子超管：`SEED_ADMIN_EMAIL` + `SEED_ADMIN_PASSWORD`（doppler）；首次启动幂等创建并赋 super_admin role；缺失环境变量时跳过 + warning。
5. **password_hash**：bcrypt 12 轮（与 E18-1 一致）。
6. **totp_secret_enc**：AES-GCM 加密存储（与 E18-4 一致），key 来自 doppler `TOTP_ENC_KEY`。
7. RLS：5 张表全部仅 service_role 可读写；普通 users RLS 拒绝（不与 C 端 users 表混用）。
8. 索引：admin_users(email)、admin_users(status)、admin_user_roles(admin_user_id)、role_permissions(role_id)。
9. 审计：本表的写操作（增 / 删 admin / 角色绑定）由 18-5 audit logs 在中间件层捕获，本 story 仅需提供必要字段（actor_id / target_id / action）。
10. 单元 + 集成测试：种子幂等、RLS 越权拒绝、bcrypt / AES 加解密。

## Tasks / Subtasks

- [ ] **Schema + migration**（AC: 1, 8）
  - [ ] `packages/db/schema/admin.ts`
  - [ ] migration `20260601_admin_rbac.sql`
- [ ] **种子**（AC: 2-4）
  - [ ] `packages/db/seeds/admin.ts`
  - [ ] 启动 cli `pnpm db:seed:admin`
- [ ] **加密 / 哈希**（AC: 5, 6）
- [ ] **RLS**（AC: 7）
- [ ] **测试**（AC: 10）

## Dev Notes

### 关键约束
- C 端 `users` 与后台 `admin_users` **绝对隔离**（不同表 / 不共享密码）。
- permission key 命名：`<resource>:<action>`，action 限定 `read` / `write` / `delete` / `approve` / `export` 等枚举；不接受自定义。
- 种子 super_admin 拥有所有 permissions（通配 `*` 不在表中而是 RBAC 中间件特例）。
- TOTP secret 解密只在登录验证瞬间，内存即销毁，禁止落日志。
- locked_until 为 null 表示未锁定；连续失败 5 次锁 15min（与 E18 / 17-2 一致）。

### 关联后续 stories
- 17-2 admin-login-totp（消费 schema）
- 17-3 rbac-middleware
- 18-5 audit logs（消费 admin_users.id 作为 actor）
- 所有后台 routes（消费 RBAC）

### Project Structure Notes
- `packages/db/schema/admin.ts`
- `packages/db/seeds/admin.ts`
- `packages/db/migrations/20260601_admin_rbac.sql`

### References
- `planning/epics/17-admin.md` ZY-17-01
- `planning/spec/05-data-model.md` § 4.16
- `planning/spec/09-security.md` § 2.2

### 测试标准
- 单元：bcrypt 验证 / AES 往返
- 集成：种子幂等 2 次执行无重复
- 安全：RLS service_role 通过 / anon 拒绝

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

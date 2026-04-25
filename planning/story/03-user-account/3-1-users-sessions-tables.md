# Story 3.1: users / sessions 表 + 迁移

Status: ready-for-dev

## Story

As a 后端工程师,
I want Supabase Postgres 中创建 `users / sessions / oauth_accounts` 表，含完整索引、RLS 策略、dev 种子数据,
so that 后续注册 / 登录 / OAuth 全部 stories 可基于稳定 schema 开发。

## Acceptance Criteria

1. 三张表按 `planning/spec/05-data-model.md §4.1, §4.2` 定义创建：
   - `users`：id uuid PK / email unique / password_hash / nickname / country_code / preferred_language / referrer_user_id / created_at / updated_at / deleted_at（软删）
   - `sessions`：id / user_id FK CASCADE / refresh_token_hash / device / ip / user_agent / expires_at / created_at
   - `oauth_accounts`：id / user_id FK CASCADE / provider（google/apple）/ provider_user_id / email / created_at；UNIQUE(provider, provider_user_id)
2. 索引齐全：`users(country_code)`、`users(referrer_user_id)`、`users(email)` UNIQUE、`sessions(user_id)`、`sessions(expires_at)`、`oauth_accounts(user_id)`。
3. Supabase RLS 启用：
   - `users`：own row read/update；service_role 全权
   - `sessions`：own row read/delete；只能由 API 通过 service_role 写入
   - `oauth_accounts`：own row read；只 service_role 写
4. 迁移文件 `apps/api/migrations/2026xxxx_create_users_sessions.sql` 可重复执行（含 `IF NOT EXISTS` 或事务回滚）。
5. dev 种子脚本：3 个测试用户（普通 / 邮件未验证 / 已删除）+ 各自 1 session + Google oauth_account。
6. 类型生成：`supabase gen types typescript` 输出到 `packages/types/src/db.ts`。
7. 自动化测试：vitest 用 testcontainers 起 Postgres → 跑迁移 → 校验表 / 索引 / RLS 行为。
8. 文档：README 添加迁移与种子的运行命令。

## Tasks / Subtasks

- [ ] Task 1: 迁移 SQL（AC: #1, #2）
  - [ ] `migrations/0003_users.sql`
  - [ ] `migrations/0004_sessions.sql`
  - [ ] `migrations/0005_oauth_accounts.sql`
- [ ] Task 2: RLS 策略（AC: #3）
  - [ ] `migrations/0006_rls_users.sql` 等
- [ ] Task 3: 种子数据（AC: #5）
  - [ ] `apps/api/scripts/seed-users.ts`
- [ ] Task 4: 类型生成（AC: #6）
  - [ ] `pnpm --filter=@zhiyu/types gen-db` 接 supabase CLI
- [ ] Task 5: 测试（AC: #7）
  - [ ] vitest + testcontainers
  - [ ] 验证 RLS 拒绝跨用户读写
- [ ] Task 6: 文档（AC: #8）

## Dev Notes

### 关键约束
- **password_hash** 字段命名固定，bcrypt 在 3-2 实施
- email 大小写不敏感：`citext` extension 或 `lower(email)` UNIQUE 索引
- `deleted_at` 软删模式 → 后续 GDPR（3-9）依赖
- 软删用户的 sessions 应在 trigger 中级联清理 refresh_token_hash

### Project Structure Notes
```
apps/api/
  migrations/
    0003_users.sql
    0004_sessions.sql
    0005_oauth_accounts.sql
    0006_rls_users.sql
  scripts/seed-users.ts
packages/types/src/db.ts (generated)
```

### 依赖链
- 依赖：S01 1-10 Supabase init
- 被依赖：3-2 ~ 3-10 全部 E03 stories

### Testing Standards
- vitest + @testcontainers/postgresql
- RLS 校验：模拟两个 jwt 用户互访被拒

### References
- [Source: planning/epics/03-user-account.md#ZY-03-01](../../epics/03-user-account.md)
- [Source: planning/spec/05-data-model.md#4-Identity](../../spec/05-data-model.md)
- [Source: planning/spec/09-security.md](../../spec/09-security.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

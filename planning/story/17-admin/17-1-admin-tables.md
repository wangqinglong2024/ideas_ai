# ZY-17-01 · admin 表（admin_users / roles / sessions / audit_log）

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 后端工程师
**I want** 管理后台与 app 用户分离的 admin schema
**So that** 后台权限不与 app 用户混淆。

## 数据模型
```sql
create table zhiyu.admin_users (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  password_hash text not null,
  totp_secret text,
  status text default 'active',           -- active | locked | deleted
  last_login_at timestamptz,
  created_at timestamptz default now()
);
create table zhiyu.admin_roles (
  id text primary key,                    -- 'admin' | 'editor' | 'cs' | 'fraud' | 'finance'
  description text
);
create table zhiyu.admin_user_roles (
  admin_id uuid references zhiyu.admin_users(id) on delete cascade,
  role_id text references zhiyu.admin_roles(id),
  primary key (admin_id, role_id)
);
create table zhiyu.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null,
  ip inet,
  user_agent text,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
create table zhiyu.audit_log (
  id bigserial primary key,
  admin_id uuid,
  action text not null,
  target_type text,
  target_id text,
  meta jsonb,
  ip inet,
  created_at timestamptz default now()
);
create index on zhiyu.audit_log (admin_id, created_at desc);
```

## Acceptance Criteria
- [ ] migration + drizzle
- [ ] 种子：5 角色 + super-admin@example.com（开发期默认密码写 docs/dev-secrets.md）
- [ ] RLS：admin schema 只允许服务端 service-role 写
- [ ] audit_log 不可修改（无 update / delete 权限）

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-admin-be pnpm vitest run admin.tables
```

## DoD
- [ ] 5 表齐 + 种子

## 依赖
- 上游：ZY-01-05
- 下游：ZY-17-02..10

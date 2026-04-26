# ZY-14-01 · 推荐表 + RLS

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 后端工程师
**I want** 推荐关系 + 邀请码 + 佣金记录三表，强 RLS
**So that** 拉新链路全链可追、不可篡改。

## 数据模型
```sql
create table zhiyu.referral_codes (
  code text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text default 'active',
  created_at timestamptz default now()
);
create unique index on zhiyu.referral_codes (user_id) where status='active';

create table zhiyu.referrals (
  child_user_id uuid primary key references auth.users(id) on delete cascade,
  parent_user_id uuid not null references auth.users(id),
  code text not null references zhiyu.referral_codes(code),
  source text,                           -- 'link' | 'poster' | 'qr'
  ip inet,
  device_id text,
  bound_at timestamptz default now(),
  status text default 'pending',          -- pending | confirmed | rejected
  confirmed_at timestamptz
);
create index on zhiyu.referrals (parent_user_id);

create table zhiyu.commissions (
  id bigserial primary key,
  parent_user_id uuid not null,
  child_user_id uuid not null,
  source_order_id uuid,
  amount_cents int,
  amount_coins int,
  status text default 'pending',          -- pending | settled | reversed
  meta jsonb,
  created_at timestamptz default now(),
  settled_at timestamptz
);
create index on zhiyu.commissions (parent_user_id, status);
```

## Acceptance Criteria
- [ ] migration + drizzle schema
- [ ] RLS：所有表仅本人可读 own / 服务端可写
- [ ] 自我邀请校验 (parent != child)
- [ ] 父子链路强校验函数 `getAncestor(userId)`

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run referral.tables
```

## DoD
- [ ] 三表齐 + RLS 通

## 依赖
- 上游：ZY-01-05
- 下游：ZY-14-02..09

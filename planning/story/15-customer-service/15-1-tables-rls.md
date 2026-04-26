# ZY-15-01 · 客服会话 / 工单表 + RLS

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 后端工程师
**I want** 客服 IM 会话 / 消息 / 工单 三表 + 强 RLS
**So that** 用户问 / 客服答 / 工单跟踪 全可追溯。

## 数据模型
```sql
create table zhiyu.cs_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  agent_id uuid,                          -- nullable until claimed
  status text default 'open',             -- open | assigned | resolved | closed
  channel text default 'im',              -- 'im' | 'email' | 'ticket'
  last_message_at timestamptz default now(),
  unread_user int default 0,
  unread_agent int default 0,
  created_at timestamptz default now()
);
create table zhiyu.cs_messages (
  id bigserial primary key,
  conversation_id uuid not null references zhiyu.cs_conversations(id) on delete cascade,
  sender_type text not null,              -- 'user' | 'agent' | 'bot'
  sender_id uuid,
  body text,
  attachments jsonb,
  created_at timestamptz default now()
);
create index on zhiyu.cs_messages (conversation_id, created_at);

create table zhiyu.cs_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  conversation_id uuid references zhiyu.cs_conversations(id),
  category text not null,                 -- 'payment' | 'bug' | 'content' | 'other'
  priority text default 'normal',         -- low | normal | high | urgent
  subject text,
  status text default 'open',             -- open | in_progress | resolved | closed
  assignee_id uuid,
  sla_due_at timestamptz,
  created_at timestamptz default now(),
  resolved_at timestamptz
);
create index on zhiyu.cs_tickets (status, sla_due_at);
```

## Acceptance Criteria
- [ ] migration + drizzle
- [ ] RLS：用户只看自己的；客服按 RBAC 看全量
- [ ] sla_due_at 自动按 priority 计算（urgent 2h / high 8h / normal 24h / low 72h）

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run cs.tables
```

## DoD
- [ ] 三表齐
- [ ] RLS 通

## 依赖
- 上游：ZY-01-05
- 下游：ZY-15-02..07

# ZY-19-02 · 错误事件表 + 上报

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 工程团队
**I want** 自建 error 事件表 + FE / BE 自动上报
**So that** 替代 Sentry，且不出境。

## 上下文
- 表 `zhiyu.error_events(id, source, env, level, message, stack, fingerprint, user_id, ctx jsonb, created_at)`
- FE：window.onerror + unhandledrejection + react ErrorBoundary 上报到 `POST /api/v1/internal/errors`（限频）
- BE：express error handler 入库
- 同 fingerprint 在 1 min 内合并成计数

## 数据模型
```sql
create table zhiyu.error_events (
  id bigserial primary key,
  source text not null,                   -- 'fe-web' | 'fe-admin' | 'be-app' | 'be-admin' | 'worker'
  env text not null,
  level text default 'error',
  fingerprint text not null,
  message text,
  stack text,
  user_id uuid,
  ctx jsonb,
  count int default 1,
  first_seen timestamptz default now(),
  last_seen timestamptz default now()
);
create index on zhiyu.error_events (fingerprint, last_seen desc);
```

## Acceptance Criteria
- [ ] migration
- [ ] FE 上报 hook（Sentry 替代）
- [ ] BE handler 写表
- [ ] dedupe by fingerprint
- [ ] admin 列表（接 ZY-17-10）

## 测试方法
- MCP Puppeteer 触发未捕获异常 → 表插入

## DoD
- [ ] 同 error 不爆库

## 依赖
- 上游：ZY-19-01

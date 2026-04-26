# ZY-03-01 · profiles / preferences / devices 表

> Epic：E03 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`profiles`（PK = `auth.users.id`）、`user_preferences`、`user_devices`
- [ ] Drizzle migration + RLS：本人可读写自己；service_role 全权
- [ ] supabase webhook（auth.user.created）→ 自动 INSERT `profiles` 占位行
- [ ] `profiles` 字段：nickname / avatar_url / country / ui_lang / hsk_level / created_at / deleted_at

## 测试方法
```bash
docker compose exec zhiyu-api pnpm db:migrate
docker compose exec supabase-db psql -U postgres -d postgres -c "\dt zhiyu.*"
```
- supabase Studio 创建用户 → 等待 1s → `profiles` 出现一行

## DoD
- [ ] 三张表 + RLS 策略落地
- [ ] webhook trigger 验证通过

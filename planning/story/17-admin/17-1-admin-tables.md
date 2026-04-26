# ZY-17-01 · admin_users / roles / permissions 表

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`admin_users`、`roles`、`permissions`、`role_permissions`
- [ ] `admin_users.id = auth.users.id`（与 supabase auth 共存）
- [ ] 种子 1 个超管（env 配置邮箱）
- [ ] RLS：仅自身可读自身

## 测试方法
- migration；超管种子注入

## DoD
- [ ] 4 表 + 1 超管

# ZY-15-01 · conversations / messages / tickets / faq 表 + RLS

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`conversations`、`messages`、`tickets`、`faq`
- [ ] 索引 (user_id, status)、(conv_id, created_at)
- [ ] RLS：user 仅看自己；客服角色（admin_users.role 含 `cs`）可看全部
- [ ] faq 多语 (locale, slug) 唯一

## 测试方法
- migration；user 跨账户读应 403

## DoD
- [ ] 4 表 + RLS 落地

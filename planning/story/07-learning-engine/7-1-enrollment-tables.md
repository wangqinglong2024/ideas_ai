# ZY-07-01 · enrollment / progress / mistakes / vocab 表

> Epic：E07 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`enrollments`、`lesson_progress`、`mistakes`、`vocab_items`
- [ ] RLS：本人可读写
- [ ] POST/GET/DELETE `/api/v1/enrollments`
- [ ] 唯一索引 (user_id, lesson_id)

## 测试方法
- migration 通过
- BE 集成：报名同节两次仅一行

## DoD
- [ ] 4 表 + RLS 落地

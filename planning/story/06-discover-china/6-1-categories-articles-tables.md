# ZY-06-01 · 分类 / 文章 / 句子 表 + CRUD

> Epic：E06 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`categories`（12 类种子）、`articles`、`sentences`
- [ ] 状态机：draft → review → published → archived
- [ ] BE CRUD（admin 角色）；前台只读已发布
- [ ] RLS：published 任意读；admin 全权
- [ ] 索引：(category_id, status, published_at)、`articles.fts_vector`

## 测试方法
- migration 通过
- supabase Studio 验证 RLS（匿名读 published / 草稿不可读）

## DoD
- [ ] 三表落地 + 12 分类种子

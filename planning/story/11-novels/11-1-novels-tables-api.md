# ZY-11-01 · novels / chapters 表 + API

> Epic：E11 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`novels`（含 12 分类）、`novel_chapters`（字数 / 价格 / TTS url 占位）
- [ ] CRUD（admin）+ 已发布只读（前台 + RLS）
- [ ] FTS 复用 ZY-06-06 jieba 配置
- [ ] 索引 (category_id, status, published_at)

## 测试方法
- migration 通过；admin 可改、匿名只读 published

## DoD
- [ ] 两表 + RLS + FTS

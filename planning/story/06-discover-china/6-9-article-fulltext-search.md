# Story 6.9: 文章全文搜索

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **搜索文章标题与正文关键词**，
以便 **快速找到我想阅读的话题**。

## Acceptance Criteria

1. 后端实现 PG 全文检索：`articles` + `sentences` 加 `tsvector` 列与 GIN 索引；中文使用 `pg_trgm` 兜底（jieba 分词集成在后续迭代）。
2. API：`GET /api/search/articles?q=&hsk=&category=&page=&size=`。
3. 命中标题 / 摘要 / 句子文本，返回包含高亮片段（`ts_headline`）。
4. 集成到 5-7 全站搜索 modal 的「文章」分组。
5. 列表页（6-2）顶部提供搜索按钮跳全站搜索 modal 并预填来源 = 文章。
6. 防 SQL 注入：使用 Drizzle 参数化查询。
7. P95 < 200ms（10k 文章）。
8. 空查询不调用接口。

## Tasks / Subtasks

- [ ] **DB 索引**（AC: 1,7）
  - [ ] migration：tsvector 列 + GIN
  - [ ] pg_trgm 扩展确认开启
  - [ ] EXPLAIN 性能验证

- [ ] **API**（AC: 2,3,6）
  - [ ] `routes/search/articles.ts`
  - [ ] `ts_headline` 高亮
  - [ ] 参数化

- [ ] **集成全站搜索**（AC: 4）
  - [ ] 5-7 中「文章」分组消费此 API

- [ ] **列表页入口**（AC: 5）
  - [ ] 列表顶部搜索按钮

- [ ] **空查询保护**（AC: 8）
  - [ ] `enabled: q.length > 0`

## Dev Notes

### 关键约束
- 中文分词 MVP 期使用 pg_trgm 三元组；后续可加 jieba。
- `ts_headline` 输出含 HTML，前端用安全渲染（白名单）。

### 关联后续 stories
- 5-7 已就位，本 story 提供数据源
- 6-1 表已存在

### Project Structure Notes
- `packages/db/migrations/xxx_articles_fts.sql`
- `apps/api/src/routes/search/articles.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-09

### 测试标准
- 集成：关键词命中正确
- 性能：10k P95 < 200ms
- 安全：注入用例无效

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

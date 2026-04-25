# Story 6.1: 分类与文章表 + API

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立中国发现内容的数据模型与 CRUD API**，
以便 **前端列表 / 详情 / 句子级阅读器有数据来源，运营能上下架**。

## Acceptance Criteria

1. Drizzle schema 创建表：`categories`、`articles`、`sentences`，含必要索引（category_id、status、hsk_level、published_at desc）。
2. `categories` 包含 12 大文化分类的种子数据（历史 / 美食 / 风景 / 节庆 / 艺术 / 音乐 / 文学 / 成语 / 哲学 / 现代 / 趣味 / 神话）。
3. `articles` 字段：id / title / slug / category_id / cover_image / hsk_level / summary / status / author / published_at / reading_time / view_count。
4. `sentences` 字段：id / article_id / order / text_zh / pinyin / translation_jsonb（含 en/vi/th/id）/ audio_url。
5. CRUD API：`GET /api/articles`（列表，支持 category / hsk / page / size）、`GET /api/articles/:slug`（详情含 sentences）、`POST/PUT/DELETE /api/admin/articles/*`（仅管理员）。
6. 状态机：`draft → review → published → archived`，仅 `published` 在用户侧 GET 中可见。
7. 索引验证：列表查询 P95 < 100ms（10k 文章）。
8. 响应包含必要分页元数据（total / page / size / hasMore）。

## Tasks / Subtasks

- [ ] **Schema 与 migration**（AC: 1,2,3,4）
  - [ ] `packages/db/schema/discover.ts`
  - [ ] migration 脚本
  - [ ] 12 分类 seed

- [ ] **API 路由**（AC: 5,6,8）
  - [ ] `apps/api/src/routes/articles.ts`
  - [ ] 列表查询 + 过滤
  - [ ] 详情含 sentences（按 order 升序）
  - [ ] admin 路由 + RBAC 中间件

- [ ] **状态机**（AC: 6）
  - [ ] 状态枚举 + 转换函数
  - [ ] 用户侧查询自动 `where status = 'published'`

- [ ] **性能验证**（AC: 7）
  - [ ] EXPLAIN ANALYZE 列表查询
  - [ ] 必要时加复合索引（category_id + status + published_at）

## Dev Notes

### 关键约束
- `translation_jsonb` 使用 GIN 索引以便 5-7 全站搜索（在 6-9 强化）。
- `sentences.audio_url` 在 6-4 使用，可后续填充。
- 管理员侧 API 在 E14 admin 完整实现；本期可先暴露最小 CRUD。

### 关联后续 stories
- 6-2 列表页消费 `GET /api/articles`
- 6-3 详情页消费 `GET /api/articles/:slug`
- 6-9 全文搜索基于本表
- E10 / E07 不依赖

### Project Structure Notes
- `packages/db/schema/discover.ts`
- `apps/api/src/routes/articles.ts`
- `apps/api/src/routes/admin/articles.ts`
- `packages/db/seeds/discover-categories.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-01
- `planning/spec/05-*` § 4.3-4.5

### 测试标准
- 单元：状态机转换合法性
- 集成：列表过滤组合 / 分页 / 详情含 sentences
- 性能：10k 文章 P95 < 100ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

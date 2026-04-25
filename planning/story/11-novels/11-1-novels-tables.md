# Story 11.1: novels / novel_chapters 表

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立小说与章节的数据模型**，
以便 **后续 API、阅读器、付费、收藏全部有数据基础**。

## Acceptance Criteria

1. Drizzle schema 创建表：`novels`、`novel_chapters`、`novel_categories`（若与 E06 categories 复用则建关联表 `novel_to_category`）。
2. `novels` 字段：`id / slug / title / author / cover_image / summary / hsk_level / category_ids / status (draft|review|published|archived) / total_chapters / free_chapters_count (默认 5) / created_at / published_at / view_count / collect_count`。
3. `novel_chapters` 字段：`id / novel_id / chapter_no / title / status / is_free (bool) / price_coins (int, 默认 0) / word_count / published_at`；正文存于 `novel_chapter_contents`（拆表，避免大字段污染列表查询）。
4. `novel_chapter_contents` 字段：`chapter_id / sentences (jsonb 数组：{order, text_zh, pinyin, translation:{en,vi,th,id}, audio_url?})`。
5. 索引：`novels(status, published_at desc)`、`novels(category_id_array GIN)`、`novel_chapters(novel_id, chapter_no)` 唯一、`novel_chapter_contents(chapter_id)` 主键。
6. RLS（Supabase 兼容）：用户侧仅 `published`；管理侧绕过。
7. 12 类目 seed（与 E06 一致：都市言情 / 古言 / 仙侠 / 玄幻 / 穿越 / 武侠 / 历史 / 悬疑 / 灵异 / 科幻 / 电竞 / 耽美）。
8. 列表查询 P95 < 100ms（10k 小说）。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1,2,3,4,5）
  - [ ] `packages/db/schema/novels.ts`
  - [ ] migration
- [ ] **RLS 策略**（AC: 6）
- [ ] **Seed**（AC: 7）
  - [ ] `packages/db/seeds/novel-categories.ts`
- [ ] **索引验证**（AC: 8）
  - [ ] EXPLAIN ANALYZE
- [ ] **测试**
  - [ ] 单元：状态机 / 唯一约束

## Dev Notes

### 关键约束
- 内容 jsonb 与 06 文章 sentences 结构对齐，便于阅读器复用。
- `free_chapters_count` 默认 5；超过的章节按 `is_free / price_coins` 决定。
- 翻译 4 语 jsonb 与发现页一致。

### Project Structure Notes
- `packages/db/schema/novels.ts`
- `packages/db/seeds/novel-categories.ts`

### References
- [Source: planning/epics/11-novels.md#ZY-11-01]
- [Source: planning/spec/05-data-model.md § 4.8]
- [Source: planning/spec/04-backend.md]

### 测试标准
- 单元 + 集成：CRUD + RLS

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

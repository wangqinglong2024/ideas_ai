# Story 11.2: 小说列表 + 详情 API

Status: ready-for-dev

## Story

作为 **前端开发者**，
我希望 **有列表与详情 API 来驱动书架与详情页**，
以便 **筛选 / 搜索 / 分页 / 章节列表展示**。

## Acceptance Criteria

1. `GET /v1/novels` 支持 query：`category` / `hsk` / `sort=hot|new|recommend` / `page` / `size (默认 20，最大 50)`。
2. 响应：`{ items: NovelListItem[], total, page, size, hasMore }`；`NovelListItem` 仅含列表展示字段（不返回 sentences / 章节内容）。
3. `GET /v1/novels/:slug` 返回 `{ ...novelMeta, chapters: [{ chapter_no, title, is_free, price_coins, published_at }] }`，章节按 `chapter_no` 升序。
4. 仅 `status = 'published'` 在用户侧可见。
5. ETag / Cache-Control：列表 60s、详情 5min；详情下 `chapters` 列表延迟可接受。
6. 列表 P95 < 150ms；详情 P95 < 200ms。
7. 错误码：404（不存在）/ 410（已 archived）。
8. OpenAPI 文档同步更新。

## Tasks / Subtasks

- [ ] **路由实现**（AC: 1,2,3,4,7）
  - [ ] `apps/api/src/routes/novels.ts`
  - [ ] `getNovels()` / `getNovelBySlug()`
- [ ] **缓存**（AC: 5）
  - [ ] CDN headers / 内存 LRU 兜底
- [ ] **OpenAPI**（AC: 8）
- [ ] **性能**（AC: 6）
  - [ ] 列表查询使用复合索引
- [ ] **测试**
  - [ ] e2e：query 组合 / 分页 / archived → 410 / 未发布隐藏

## Dev Notes

### 关键约束
- 列表 SELECT 不带 contents；章节列表不带 contents，仅元数据。
- `category` 支持单选；多选与排序权重交给 11-4 前端做。

### Project Structure Notes
- `apps/api/src/routes/novels.ts`
- `apps/api/src/openapi/novels.ts`

### References
- [Source: planning/epics/11-novels.md#ZY-11-02]
- [Source: planning/spec/04-backend.md]

### 测试标准
- 单元 / 集成 / e2e

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

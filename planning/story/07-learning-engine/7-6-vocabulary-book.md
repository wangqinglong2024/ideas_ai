# Story 7.6: 生词本（vocabulary_book）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **能将课程 / 文章 / 游戏中遇到的生词加入个人词本，并参与 SRS 复习**，
以便 **构建专属词汇资产**。

## Acceptance Criteria

1. 表 `vocabulary_book`：id / user_id / word / pinyin / translation_jsonb / source_type / source_id / added_at / next_review_at / ease_factor / interval / mastered。
2. `POST /v1/me/vocabulary` `{ word, source_type, source_id }`：去重（同 user_id+word 唯一），自动补全 pinyin / translation（调内容词典服务）。
3. `GET /v1/me/vocabulary?filter=all|due|mastered&search=&page=&size=` 列表 + 分页 + 搜索。
4. `DELETE /v1/me/vocabulary/:id` 删除。
5. `POST /v1/me/vocabulary/:id/review` 复习答题接口（与 7-5 SRS 联动）。
6. 单用户上限 5000 词，达上限提示「已满，请先复习」。
7. RLS：仅 owner 可访问。
8. 限流：写 30/min，读 60/min。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1,7）
- [ ] **API**（AC: 2,3,4,5,6,8）
- [ ] **Auto-fill 词典**
  - [ ] `services/dictionary.service.ts`：本地词典 + 兜底
- [ ] **测试**

## Dev Notes

### 关键约束
- translation_jsonb 含 4 语种；缺失语言时回退英文。
- 上限保护防止滥用，未来可付费扩容（E13）。

### 关联后续 stories
- 7-5 SRS 调度
- 8-7 节学习页「+词本」按钮调用此 API

### Project Structure Notes
- `apps/api/src/routes/me/vocabulary.ts`
- `packages/db/schema/learning.ts`（vocabulary_book）

### References
- `planning/epics/07-learning-engine.md` ZY-07-06

### 测试标准
- 单元：去重 / 上限
- 集成：search 命中 / 分页
- 性能：list P95 < 100ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

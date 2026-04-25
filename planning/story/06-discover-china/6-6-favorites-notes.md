# Story 6.6: 收藏 / 笔记

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **收藏文章 / 句子，并能写笔记**，
以便 **以后回顾我感兴趣的内容与思考**。

## Acceptance Criteria

1. 数据表：`favorites`（id / user_id / target_type[article|sentence|word] / target_id / created_at）、`notes`（id / user_id / target_type / target_id / content / created_at / updated_at）。
2. API：`POST/DELETE /api/me/favorites`、`GET /api/me/favorites?type=&page=`、`POST/PUT/DELETE/GET /api/me/notes`。
3. 详情页（6-3）顶部收藏按钮切换收藏态；句子右侧小图标可单句收藏 / 加笔记。
4. 笔记编辑：弹窗 textarea，最大 2000 字符，支持取消。
5. `/me/notes` 个人页：列表展示笔记 + 跳转到原句 / 文章。
6. 列表分页 20/页。
7. 401 未登录交互：触发收藏 / 笔记时跳登录页。
8. 4 语 i18n。

## Tasks / Subtasks

- [ ] **Schema + API**（AC: 1,2）
  - [ ] `packages/db/schema/me.ts`（favorites + notes）
  - [ ] migration
  - [ ] `apps/api/src/routes/me/favorites.ts` / `notes.ts`

- [ ] **详情页集成**（AC: 3）
  - [ ] 文章级收藏按钮
  - [ ] 句子级收藏 / 笔记快捷图标

- [ ] **笔记弹窗**（AC: 4）
  - [ ] `<NoteEditor>` modal
  - [ ] 字数计数 + 校验

- [ ] **`/me/notes` 页**（AC: 5,6）
  - [ ] `routes/_app/me/notes.tsx`
  - [ ] `useInfiniteQuery`

- [ ] **未登录处理**（AC: 7）
  - [ ] mutation onError 401 → redirect login

## Dev Notes

### 关键约束
- 笔记跳回原句需要 anchor（`#sentence-{id}`），路由滚动到该锚点。
- 笔记编辑乐观更新：mutate 时立即更新缓存。

### 关联后续 stories
- 6-3 注入收藏 / 笔记入口
- 6-5 单字加入收藏复用
- E03 用户态

### Project Structure Notes
- `packages/db/schema/me.ts`
- `apps/api/src/routes/me/favorites.ts`
- `apps/api/src/routes/me/notes.ts`
- `apps/app/src/features/me/NoteEditor.tsx`
- `apps/app/src/routes/_app/me/notes.tsx`

### References
- `planning/epics/06-discover-china.md` ZY-06-06

### 测试标准
- 集成：收藏 / 取消收藏 / 笔记 CRUD
- E2E：未登录触发跳登录
- 单元：字数校验

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

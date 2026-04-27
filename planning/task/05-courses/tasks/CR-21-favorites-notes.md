# CR-21 · 知识点收藏 / 笔记

## PRD 原文引用

- `CR-FR-018`：“行为：知识点右上角心形 → 收藏；个人中心：`/me/favorites?type=knowledge_point`。”
- `CR-FR-019`：“行为：知识点菜单 → 笔记；限制：500 字。”

## 需求落实

- 数据表：`user_favorites(id, user_id, target_type, target_id, created_at, UNIQUE(user_id, target_type, target_id))`、`user_notes(id, user_id, target_type, target_id, body TEXT, updated_at, UNIQUE(user_id, target_type, target_id))`。
- API：
  - `POST/DELETE /api/me/favorites` `{target_type, target_id}`。
  - `PUT/DELETE /api/me/notes` `{target_type, target_id, body}`。
  - `GET /api/me/favorites?type=knowledge_point&page=`。
  - `GET /api/me/notes?type=knowledge_point&page=`。
- 组件：FavoriteButton、NotePopover、NotesListPage。

## 状态逻辑

- 收藏即时反馈，乐观更新 + 失败回滚。
- 笔记 500 字 hard limit；超限时按钮 disabled 并提示。
- target_type ∈ {`knowledge_point`,`sentence`,`article`,`question`}。

## 不明确 / 风险

- 风险：与 DC 模块收藏/笔记表是否合一？
- 处理：合一为统一 `user_favorites`/`user_notes`，target_type 区分；DC 已有同表则共用。

## 技术假设

- RLS 启用 user_id = auth.uid。
- 笔记 body 不渲染 HTML（XSS 防护）。

## 最终验收清单

- [ ] 知识点点心形 → favorites 写入；再点 → 删除。
- [ ] 笔记 500 字超限阻止保存。
- [ ] `/me/favorites?type=knowledge_point` 列表分页正常。
- [ ] 跨 target_type 表查询正确。
- [ ] RLS 防止跨用户读写。

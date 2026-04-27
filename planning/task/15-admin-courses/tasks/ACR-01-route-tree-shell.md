# ACR-01 · 课程后台路由与树形壳

## PRD 原文引用

- `AD-FR-006`：“CR：tracks/stages/chapters/lessons/knowledge_points 树形。”
- `planning/ux/11-screens-admin.md`：“内容管理 - 课程：4 轨道 / 12 阶段 / 12 章 / 12 节。”

## 需求落实

- 页面：`/admin/content/courses`（树形主视图）。
- 子路由：
  - `/admin/content/courses/tracks/:track_code`
  - `/admin/content/courses/stages/:stage_id`
  - `/admin/content/courses/chapters/:chapter_id`
  - `/admin/content/courses/lessons/:lesson_id`
  - `/admin/content/courses/knowledge-points/:kp_id`
  - `/admin/content/courses/questions`
  - `/admin/content/courses/quizzes`
- 组件：CourseTreePanel（左侧）、CourseDetailPane（右侧）、TreeNodeContextMenu、TreeSearchInput、TreeFilterChips。
- API：`GET /admin/api/content/courses/tree?track=&depth=` 返回懒加载树。

## 状态逻辑

- 树展开层级：默认到 chapter 层；lesson/knowledge_point 按需展开。
- 节点状态颜色：published(绿)、draft(灰)、archived(红)。
- 搜索：按 slug / name_zh / external_id。
- RBAC：editor 可写，reviewer 只读。

## 不明确 / 风险

- 风险：4 × 12 × 12 × 12 × 12 节点过多，全展开性能差。
- 处理：懒加载 + 虚拟滚动；最多一层一次返回 ≤ 200 节点。

## 技术假设

- 路由按 React Router lazy load 拆分。
- 树状态保留在 URL query（便于分享链接）。

## 最终验收清单

- [ ] 进入 `/admin/content/courses` 看到 4 轨道根节点。
- [ ] 展开到 lesson 流畅（< 500ms）。
- [ ] 搜索 lesson slug 命中并跳到节点。
- [ ] 节点状态颜色正确。
- [ ] 写操作走 audit_logs。

# Story 17.7: 内容管理 - 课程（树状 + 步骤编辑器）

Status: ready-for-dev

## Story

作为 **课程内容编辑**，
我希望 **以树状结构管理课程：轨道 / 阶段 / 章 / 节 / 节内步骤**，
以便 **完整维护 HSK / Daily / Ecommerce / Factory 4 大轨道的 12 阶段课程内容**。

## Acceptance Criteria

1. 路由 `/admin/content/courses`：左侧树状（track → stage → chapter → lesson）+ 右侧详情 / 步骤编辑器。
2. 树支持：拖拽排序（同级）/ 折叠 / 搜索 / 状态徽标（draft / published / archived）。
3. **节内步骤编辑器**：列表显示 10-15 步骤；可增删 / 拖拽排序 / 切换 step type。
4. **每种 step type** 提供独立表单（依赖 8-2 spec）：vocab_intro / pinyin_match / sentence_listen / dictation / fill_blank / mc / sort / speak_repeat / final_quiz 等。
5. **payload schema 校验**：保存前 Zod 校验，错误高亮在字段。
6. **scoring 规则编辑**：每步骤提供 JSON 编辑器 + 友好表单切换。
7. **多语**：同 17-6，多 tab；prompts / hints / explanations 翻译。
8. **预览**：预览按钮在新窗口打开端用户学习页（带 admin token）。
9. **复制 / 模板**：节级 / 步骤级一键复制；保存为模板（`lesson_templates`）。
10. **状态流转**：lesson 级 draft → review → published → archived；阶段 / 章发布要求所有 lesson published。
11. **权限**：`courses:read|write|publish|bulk`。
12. **审计** + e2e 测试。

## Tasks / Subtasks

- [ ] **API**（AC: 1-3, 10, 11）
  - [ ] `apps/api/src/routes/admin/content/courses/*.ts`
- [ ] **树状 UI**（AC: 1, 2）
  - [ ] dnd-kit + virtualized
- [ ] **步骤编辑器**（AC: 3-6）
  - [ ] 10+ step type forms
- [ ] **多语 + 预览**（AC: 7, 8）
- [ ] **复制 / 模板**（AC: 9）
- [ ] **测试**

## Dev Notes

### 关键约束
- step type 表单严格按 8-2 spec；新 type 必须先更 spec + Zod schema。
- 拖拽排序：批量更新 order_index，事务包裹。
- 树节点搜索：基于 ts-morph 之类全文索引（小规模可 LIKE）。
- 模板存表 `lesson_templates`：snapshot payload + scoring，引用时深拷贝。
- 性能：单节 15 步骤编辑器渲染 < 100ms；大树（500 节点）虚拟滚动。

### 关联后续 stories
- 17-1 ~ 17-4
- 16-5 lesson flow
- 8-2 step type spec

### Project Structure Notes
- `apps/admin/src/pages/content/courses/`
  - `Tree.tsx` / `LessonEditor.tsx` / `StepForms/*.tsx`
- `packages/lesson-step-schemas/`（共享）

### References
- `planning/epics/17-admin.md` ZY-17-07
- `planning/epics/08-courses.md` 8-2

### 测试标准
- e2e：创建 stage → chapter → lesson → 步骤编辑 → 预览 → 发布
- 性能：500 节点树拖拽流畅
- 安全：权限边界

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

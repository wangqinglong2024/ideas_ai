# Story 8.6: 阶段详情页（12 阶段树状视图）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **进入一条轨道后看到 12 个阶段的进度树、当前解锁阶段及阶段下的节列表**，
以便 **了解学习全貌并挑选要学的节**。

## Acceptance Criteria

1. 页面路径 `app/(tabs)/courses/[track]/index.tsx`。
2. 顶部：track 简介 + 报名按钮（未报名）/ 进度环（已报名）。
3. 12 阶段以树状 / 阶梯式呈现，已解锁 / 当前 / 未解锁三态。
4. 点击阶段 → 展开节列表（同页面 inline expand 或 push 到 `[track]/[stage]`）。
5. 节点击 → `/lessons/[id]`（8-7）。
6. 报名按钮触发 7-2 POST enrollments，成功后页面切换为已报名状态。
7. 4 语种 i18n + 骨架屏。
8. 滚动锚点：自动滚到当前阶段。

## Tasks / Subtasks

- [ ] **页面**（AC: 1,2,3,7,8）
- [ ] **阶段树组件**（AC: 3）
  - [ ] `components/courses/StageTree.tsx`
- [ ] **节列表组件**（AC: 4）
- [ ] **报名集成**（AC: 6）

## Dev Notes

### 关键约束
- 阶段解锁由 lesson_unlocks 表（7-4）决定；未解锁阶段灰显并 disable。
- 进度环动画使用 reanimated v3。

### 关联后续 stories
- 8-3 GET /tracks/:slug
- 7-2 enroll
- 8-7 跳转

### Project Structure Notes
- `apps/mobile/app/(tabs)/courses/[track]/index.tsx`
- `apps/mobile/components/courses/StageTree.tsx`

### References
- `planning/epics/08-courses.md` ZY-08-06
- `planning/ux/courses-track-detail.md`

### 测试标准
- 视觉：未报 / 已报 / 部分完成
- 集成：报名后 UI 切换

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

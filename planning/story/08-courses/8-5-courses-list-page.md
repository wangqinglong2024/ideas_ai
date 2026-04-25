# Story 8.5: 课程列表页（4 轨道）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **在「课程」Tab 看到 4 条轨道（日常 / 电商 / 工厂 / HSK），可查看难度与是否报名**，
以便 **挑选并进入感兴趣的轨道**。

## Acceptance Criteria

1. 页面路径 `app/(tabs)/courses/index.tsx`。
2. 顶部 hero：今日推荐 / 当前在学进度。
3. 4 张大卡片：cover、track 名称（i18n）、难度、阶段总数、状态（已报名 / 未报名 / 推荐）。
4. 点击卡片 → `/courses/[track]`（8-6）。
5. 已报名轨道置顶。
6. 4 语种 i18n。
7. 骨架屏 + 错误回退（重试按钮）。
8. 视觉规范：与 02 设计系统一致。

## Tasks / Subtasks

- [ ] **页面**（AC: 1,2,3,4,5,7）
  - [ ] `apps/mobile/app/(tabs)/courses/index.tsx`
  - [ ] hero 组件
  - [ ] track card 组件
- [ ] **API 接入**
  - [ ] `useTracks()` hook（react-query）
  - [ ] `useMyEnrollments()` hook
- [ ] **i18n**（AC: 6）
- [ ] **视觉**（AC: 8）

## Dev Notes

### 关键约束
- hero 推荐数据来自 7-12 dashboard recommended.next_lesson。
- 4 卡片为固定数量，不做无限滚动。
- 视觉间距与圆角参考设计系统 token。

### 关联后续 stories
- 8-3 API 消费
- 8-6 跳转
- 7-12 dashboard 数据

### Project Structure Notes
- `apps/mobile/app/(tabs)/courses/index.tsx`
- `apps/mobile/components/courses/TrackCard.tsx`
- `apps/mobile/hooks/useTracks.ts`

### References
- `planning/epics/08-courses.md` ZY-08-05
- `planning/ux/courses-list.md`

### 测试标准
- 视觉：4 语种 / 已报 vs 未报
- 集成：MSW mock API

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

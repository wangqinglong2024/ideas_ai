# Story 8.7: 节学习页（10 步骤主容器）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **进入一节课后能逐步推进 10 个步骤，看到进度条、当前题、上一步 / 下一步、退出按钮**，
以便 **稳定地完成节学习**。

## Acceptance Criteria

1. 页面路径 `app/lessons/[id]/index.tsx`，全屏沉浸（隐藏底部 tab）。
2. 顶部：进度条 (n/total) + 退出按钮（带「确认离开」对话框）。
3. 中部：当前 step 渲染区域，依据 step_type 加载对应组件（来自 8-8）。
4. 底部：Submit / Next 按钮，未答时灰显。
5. 退出 → 调 8-4 abandon → 跳回阶段详情。
6. 答完最后一步 → 跳 8-9 结算页。
7. 步骤切换动画（横滑 / 缩放，250ms）。
8. 错误回退：网络异常 toast + 重试。
9. 4 语种 i18n。

## Tasks / Subtasks

- [ ] **容器页**（AC: 1,2,4,5,6,7,8,9）
- [ ] **步骤渲染调度器**（AC: 3）
  - [ ] `components/lesson/StepRenderer.tsx` 路由 step_type 到组件
- [ ] **API 接入**
  - [ ] `useLessonStart` / `useSubmitAnswer`
- [ ] **状态机**
  - [ ] `useLessonReducer` 管理 currentIndex / responses

## Dev Notes

### 关键约束
- 容器只负责调度，不要把 step UI 写在这里。
- 退出确认对话框文本来自 i18n。
- 进度条动画使用 reanimated。

### 关联后续 stories
- 8-4 / 7-3 API
- 8-8 步骤组件
- 8-9 结算页

### Project Structure Notes
- `apps/mobile/app/lessons/[id]/index.tsx`
- `apps/mobile/components/lesson/StepRenderer.tsx`
- `apps/mobile/hooks/useLessonReducer.ts`

### References
- `planning/epics/08-courses.md` ZY-08-07
- `planning/ux/lesson-learning.md`

### 测试标准
- E2E：跑通 1 节 10 步
- 集成：abandon 路径

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

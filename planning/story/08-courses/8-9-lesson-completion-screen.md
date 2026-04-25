# Story 8.9: 节完成结算页

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **完成一节课后看到 XP / 知语币 / 正确率 / 用时 / 错题数 / 推荐复习与游戏，并选择「下一节 / 错题重做 / 返回」**，
以便 **获得正反馈并自然过渡到下一步学习**。

## Acceptance Criteria

1. 页面路径 `app/lessons/[id]/complete.tsx`。
2. 上方动画：星星雨 / 撒花（lottie / reanimated 二选一）。
3. 数据卡片：得分、XP、知语币、用时、错题数、是否升级、streak 当前天数。
4. 推荐区：今日复习计数 + 3 个推荐游戏卡片 + 下一节按钮。
5. 按钮：下一节（默认）/ 错题重做（跳错题本筛选当前 lesson）/ 返回阶段。
6. 4 语种 i18n。
7. 数据来源：8-4 complete 接口或 7-4 settlement 返回值（前端缓存 settlement payload）。
8. 升级 / streak 里程碑触发额外横幅动画（一次性）。

## Tasks / Subtasks

- [ ] **页面**（AC: 1,5,6）
- [ ] **动画**（AC: 2,8）
  - [ ] lottie file
- [ ] **卡片组件**（AC: 3）
- [ ] **推荐组件**（AC: 4）

## Dev Notes

### 关键约束
- settlement 数据应在跳转时通过路由参数 / state 传递，避免再次查接口。
- 升级横幅与 streak 横幅分开两次显示，互不打架（队列 + 一次性 flag）。

### 关联后续 stories
- 7-4 settlement
- 7-12 dashboard 推荐
- 7-7 错题本

### Project Structure Notes
- `apps/mobile/app/lessons/[id]/complete.tsx`
- `apps/mobile/components/lesson/CompletionCard.tsx`

### References
- `planning/epics/08-courses.md` ZY-08-09

### 测试标准
- 视觉：升级 / 不升级 / 三星 / 二星
- 集成：跳错题本带筛选

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

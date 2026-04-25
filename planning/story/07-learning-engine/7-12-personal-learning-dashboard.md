# Story 7.12: 个人学习仪表盘（前端 + 聚合 API）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **进入「我的学习」看到 XP、等级、streak、错题总数、词本总数、今日复习推荐、近 7 日学习曲线**，
以便 **掌握自己的学习全貌**。

## Acceptance Criteria

1. 聚合 API `GET /v1/me/dashboard` 一次返回所有卡片数据（避免前端 N 请求）：
   - xp（来自 7-8）
   - streak（来自 7-9）
   - mistakes_unmastered_total / vocabulary_total / reviews_due_today
   - last_7_days：每日 xp / 节数 / 用时
   - hsk_auto_level vs hsk_self_level（来自 7-10 / 7-11）
   - 推荐：next_lesson / today_reviews / recommended_games（最多 3）
2. 响应需在 P95 < 200ms（必要时使用 materialized view 或 Redis 缓存 60s）。
3. 前端页面 `app/(tabs)/learn/dashboard.tsx`，使用 6 张卡片 + 柱状图（react-native-svg）。
4. 卡片支持点击跳转到对应详情页（错题本 / 词本 / 复习 / 等级详情）。
5. 4 语种 i18n。
6. 空状态：新用户尚无数据 → 引导 CTA「开始学习」。

## Tasks / Subtasks

- [ ] **聚合 API**（AC: 1,2）
  - [ ] `routes/me/dashboard.ts`
  - [ ] Redis 缓存 wrapper
- [ ] **前端页面**（AC: 3,4,5,6）
  - [ ] `apps/mobile/app/(tabs)/learn/dashboard.tsx`
  - [ ] 卡片组件 6 个
  - [ ] 柱状图组件
- [ ] **i18n**（AC: 5）
- [ ] **测试**

## Dev Notes

### 关键约束
- 聚合数据严禁前端再次拼接：后端必须给「视图层就绪」。
- last_7_days 数据从 `user_daily_stats`（由 7-4 / 7-9 / 7-5 共同写入）。
- 无需 SSR。

### 关联后续 stories
- 7-1 ~ 7-11 全部依赖
- 5-* shell 注册路由

### Project Structure Notes
- `apps/api/src/routes/me/dashboard.ts`
- `apps/mobile/app/(tabs)/learn/dashboard.tsx`
- `apps/mobile/components/dashboard/*.tsx`

### References
- `planning/epics/07-learning-engine.md` ZY-07-12
- `planning/ux/` 仪表盘原型

### 测试标准
- 集成：聚合返回完整字段
- 性能：P95 < 200ms（带缓存）
- 视觉：4 语种 / 空状态 / 不同等级

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

# CR-06 · 课程 Dashboard `/learn`

## PRD 原文引用

- `CR-FR-003`：“路径：`/learn`。元素：当前学习中的轨道卡片（带进度条）；‘继续学习’按钮（跳到上次未完成的节）；今日任务（节 / 章 / 温故知新 推送）；学习时长统计（本周）；切换轨道 tab。”
- `content/course/00-index.md`：“多轨可并行学习。”

## 需求落实

- 页面：`/learn`（C 端 SSR + 客户端激活）。
- 组件：DashboardHeader、CurrentTrackCard、ContinueLearningButton、TodayTasksList、WeeklyStudyTimeChart、TrackSwitcherTabs、PinyinOnboardingCallout、CourseRecommendationCarousel。
- API：
  - `GET /api/learn/dashboard` → `{enrollments: [{track, current_stage, current_chapter, current_lesson, progress_pct}], today_tasks: [...], weekly_study_minutes, last_active_at}`。
  - `GET /api/learn/tracks/:code/dashboard`（轨道粒度）。
- 缓存：用户级 5 min。

## 状态逻辑

- 未登录 → 跳 `/login?next=/learn`。
- 已登录但未 onboarded → 跳 `/onboarding/courses`（除非 `metadata.onboarded_courses='skipped'`）。
- 无 enrollment → 显示 4 张轨道卡片 + “拼音入门（推荐）”入口。
- 多轨 enrollment → 默认 tab 为 `last_active` 轨道。
- “继续学习”跳到 `last_active_lesson`；若 lesson 已完成，跳下一个未完成 lesson；若 chapter 已完成，跳同章测；若 stage 全完成，跳阶段考。

## 不明确 / 风险

- 风险：今日任务来源跨模块（CR / LE 温故知新 / GM 游戏推荐），耦合度高。
- 处理：`today_tasks` 由 backend 聚合服务统一返回；前端只渲染。

## 技术假设

- WeeklyStudyTimeChart 使用 7 天柱状图（本周一到今天），单位分钟。
- 无 enrollment 状态下也展示 weekly_study_minutes（含拼音入门时长）。

## 最终验收清单

- [ ] 已 onboarded 用户进入 `/learn` 看到当前轨道卡 + 进度。
- [ ] “继续学习”按钮跳到正确 lesson（覆盖完成/未完成场景）。
- [ ] 多轨道 tab 切换 < 200ms（数据已预拉）。
- [ ] WeeklyStudyTimeChart 与 `learning_session` 一致。
- [ ] 未登录访问被引导至登录。

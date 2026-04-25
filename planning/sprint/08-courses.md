# Sprint S08 · 课程模块（Courses）

> Epic：[E08](../epics/08-courses.md) · 阶段：M3 · 周期：W15-W19 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-8)

## Sprint 目标
4 轨道（日常 / 电商 / 工厂 / HSK）× 12 阶段，全步骤化学习；与学习引擎深度集成；节级付费墙。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 8-1-course-tables-migration | course_* 表迁移 | M | S01 | W15 |
| 2 | 8-2-step-type-spec | 步骤类型规范 + Zod schema | M | 8-1 | W15 |
| 3 | 8-3-courses-list-detail-api | 课程列表 / 详情 API | M | 8-1 | W16 |
| 4 | 8-4-lesson-learning-api | 节学习 API（接 E07） | M | 8-3,S07 | W16 |
| 5 | 8-5-courses-list-page | 课程列表页（4 轨道） | M | 8-3,S05 | W16 |
| 6 | 8-6-stage-detail-page | 阶段详情页 | M | 8-3 | W17 |
| 7 | 8-7-lesson-learning-page | 节学习页（核心 UI） | L | 8-4,S02 | W17-W18 |
| 8 | 8-8-ten-step-components | 10 种步骤组件 | L | 8-2,8-7 | W18-W19 |
| 9 | 8-9-lesson-completion-screen | 节完成结算页 | M | 8-7 | W19 |
| 10 | 8-10-paywall-lesson-level | 付费墙（节级） | M | 8-4,S13 | W19 |

## 步骤类型清单（8-8）
sentence / word_card / choice / order / match / listen / read(v1.5 ASR) / translate / type_pinyin / dialog

## 风险
- 步骤组件复杂 → 抽象 step component 接口；先做 5 种再迭代
- 付费转化 UX → A/B 测试三种弹窗

## DoD
- [ ] 4 轨道各 ≥ 1 阶段可学（demo 内容）
- [ ] 节学习流畅 60fps
- [ ] 付费墙转化埋点（PostHog）
- [ ] 10 种步骤组件 100% 覆盖测试
- [ ] retrospective 完成

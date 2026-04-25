# Sprint S07 · 学习引擎（Learning Engine）

> Epic：[E07](../epics/07-learning-engine.md) · 阶段：M2 · 周期：W9-W14（5 周） · 优先级：P0
> Story 数：12 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-7)

## Sprint 目标
课程 / 阅读 / 游戏 共用的学习引擎：进度跟踪、SRS 复习、错题、HSK 评估、XP / 等级 / streak。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 7-1-enrollments-progress-mistakes-tables | 表 + 索引 + RLS | M | S01 | W9 |
| 2 | 7-2-course-enrollment-api | 报名 / 进入 / 退出 API | S | 7-1 | W9 |
| 3 | 7-3-step-progression-api | 步骤推进 + 答案校验 | L | 7-1 | W10 |
| 4 | 7-4-lesson-completion-settlement | 节完成结算（XP/币） | M | 7-3 | W10 |
| 5 | 7-5-srs-review-engine | SM-2 简化 SRS 引擎 | L | 7-1 | W11 |
| 6 | 7-6-vocabulary-book | 生词本 | M | 7-5 | W11 |
| 7 | 7-7-mistake-book | 错题本 | M | 7-3,7-5 | W12 |
| 8 | 7-8-xp-and-levels | XP 公式 + 等级 1-100 | M | 7-4 | W12 |
| 9 | 7-9-streak-system | 连续学习 + 冻结 | M | 7-4 | W13 |
| 10 | 7-10-hsk-self-assessment | HSK 自评（v1） | S | S03 | W13 |
| 11 | 7-11-hsk-auto-assessment-stub | HSK 自动评估（v1.5 占位） | M | 7-3 | W13 |
| 12 | 7-12-personal-learning-dashboard | 个人学习数据看板 | M | 7-8,7-9 | W14 |

## 风险
- SRS 算法 CPU 压力 → 后端计算 + 增量更新
- streak 失败挫败感 → 月度 1 次免费冻结 + UX 安抚

## DoD
- [ ] 进度 / XP / streak 全跑通
- [ ] SRS 推荐准确率 > 80%（人工评估 100 例）
- [ ] HSK 自评准确度 ±1 等级
- [ ] 数据看板可视化清晰；周月报表准确
- [ ] retrospective 完成

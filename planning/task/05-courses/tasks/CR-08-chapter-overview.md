# CR-08 · 章节总览 `/learn/:track/:stage/:chapter`

## PRD 原文引用

- `CR-FR-005`：“路径：`/learn/:track/:stage/:chapter`。元素：章节标题 + 介绍；12 节列表（已完成 / 进行中 / 未开始）；章测入口（12 节全完成后解锁）。”

## 需求落实

- 页面：`/learn/:track/:stage/:chapter`。
- 组件：ChapterHeader、ChapterDescription、LessonList（12 行）、ChapterTestEntry、ChapterProgressBar、ChapterFreeBadge。
- API：`GET /api/learn/chapters/:chapter_id` 返回章详情 + 12 节 + 每节进度。

## 状态逻辑

- 节状态：`completed | in_progress | skipped | not_started`。
- 章测入口：`completed_lessons + skipped_lessons == 12`（跳过节计入完成）才解锁；通过线 70%。
- 免费章在头部显示绿色“免费试学”徽章，非免费章显示锁徽章并触发付费墙。

## 不明确 / 风险

- 风险：跳过节（CR-22）是否计入章测解锁条件？
- 处理：跳过算解锁但不算成绩；章测仍须做满 36 题。报告中标注被跳过的节。

## 技术假设

- 节学习入口点击校验 `has_access`；未授权直接弹付费墙，不进入节学习页。

## 最终验收清单

- [ ] 章页正确显示 12 节状态。
- [ ] 12 节全 completed 后章测入口可点。
- [ ] 跳过节进入章页后状态显示为“跳过”。
- [ ] 未授权章访问触发付费墙。
- [ ] 章测点击进入 `/learn/:track/:stage/:chapter/test`。

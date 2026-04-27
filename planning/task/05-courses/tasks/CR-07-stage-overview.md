# CR-07 · 阶段总览 `/learn/:track/:stage`

## PRD 原文引用

- `CR-FR-004`：“路径：`/learn/:track/:stage`。元素：阶段标题 + 介绍（母语）；12 章网格（已完成 / 进行中 / 未解锁）；阶段进度条；阶段考入口（12 章全完成后解锁）。”

## 需求落实

- 页面：`/learn/:track/:stage`。
- 组件：StageHeader、StageDescription、ChapterGrid（12 格）、StageProgressBar、StageExamEntry、PaywallBadge。
- API：`GET /api/learn/stages/:stage_id` 返回阶段详情 + 12 章 + 每章 `has_access` + 每章进度。
- 权限：调用 `canAccessCourseNode` 决定每章 `has_access`；未授权章显示锁标 + 付费墙触发器。

## 状态逻辑

- 章状态：`completed | in_progress | not_started | locked_paywall | locked_prereq_advice`。
- `locked_prereq_advice`：prerequisite_stage 未完，仅显示建议提示而不阻塞（允许跨级）。
- 阶段考入口：`completed_chapters_count == 12` 才显高亮可点；否则灰显 + “完成全部 12 章后解锁”tooltip。
- 阶段进度 = 已完成章数 / 12。

## 不明确 / 风险

- 风险：track=hsk 时 stage 名称包含 “HSK 1” 等表述；非 HSK track 不应该显示 HSK 等级标签。
- 处理：StageHeader 仅 hsk track 显示 HSK 等级徽章；其他 track 显示场景标签（电商/工厂/日常）。

## 技术假设

- 阶段介绍（母语）从 `content_stages.description` JSONB 按当前 ui_lang 取值。
- 12 章网格采用 `aspect-square` 卡片，移动端 3×4，桌面 4×3。

## 最终验收清单

- [ ] HSK Stage 1 章 1-3 显示 “免费试学”徽章，章 4-12 显示锁。
- [ ] 点击锁章触发付费墙弹窗（CR-18）。
- [ ] 章 1-12 全 completed 时阶段考入口高亮。
- [ ] 跨级购买的 stage 9 在 `/learn/ec/9` 直接显示 12 章（章 1-3 仍按 ec 轨自身免费规则）。
- [ ] 非 HSK 轨道页面不显示 HSK 等级筛选 / 标签。

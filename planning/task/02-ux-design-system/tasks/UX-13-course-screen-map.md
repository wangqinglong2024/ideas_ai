# UX-13 · 实现课程屏幕地图

## 原文引用

- `planning/ux/09-screens-app.md`：“4 学习轨道。”
- `planning/ux/09-screens-app.md`：“12 阶段地图 - 蜿蜒小径。”
- `content/course/00-index.md`：“4 条独立轨道 × 12 阶段 × 12 章 × 12 节 × 12 知识点。”

## 需求落实

- 页面：`/courses`、`/courses/:track`、`/courses/:track/:stage`、`/courses/.../:lesson`、阶段完成页。
- 组件：TrackCard、StageMap、ChapterList、LessonShell、QuestionStep、CompletionSummary。
- API：CR/LE 模块接入课程与进度 API。
- 数据表：课程表、进度表由 CR/LE 实现。
- 状态逻辑：沉浸式节学习页隐藏 TabBar；未解锁阶段显示锁状态。

## 技术假设

- UX 中“跟读评分”与内容规则“不做 AI 评分”冲突，界面可保留跟读/播放练习但不得显示 AI 评分。

## 不明确 / 风险

- 风险：课程 UX 使用 steps，多于 PRD 的 12 知识点模型。
- 处理：步骤 UI 映射到知识点/题型，不新增未定义内容类型。

## 最终验收清单

- [ ] 4 轨道入口可见。
- [ ] 12 阶段地图可渲染锁定/当前/完成态。
- [ ] 节学习页无 TabBar 且有进度。
# UX-13 · 实现课程屏幕地图

## 原文引用

- `planning/ux/09-screens-app.md`：“4 学习轨道。”
- `planning/ux/09-screens-app.md`：“12 阶段地图 - 蜿蜒小径。”
- `content/course/00-index.md`：“4 条独立轨道 × 12 阶段 × 12 章 × 12 节 × 12 知识点。”

## 需求落实

- 页面：`/courses`、`/courses/:track`、`/courses/:track/:stage`、`/courses/.../:lesson`、阶段完成页。
- 组件：TrackCard、StageMap、ChapterList、LessonShell、QuestionStep、CompletionSummary。
- API：CR/LE 模块接入课程与进度 API。
- 数据表：课程表、进度表由 CR/LE 实现。
- 状态逻辑：沉浸式节学习页隐藏 TabBar；未解锁阶段显示锁状态。

## 技术假设

- UX 中“跟读评分”与内容规则“不做 AI 评分”冲突，界面可保留跟读/播放练习但不得显示 AI 评分。

## 不明确 / 风险

- 风险：课程 UX 使用 steps，多于 PRD 的 12 知识点模型。
- 处理：步骤 UI 映射到知识点/题型，不新增未定义内容类型。

## 最终验收清单

- [ ] 4 轨道入口可见。
- [ ] 12 阶段地图可渲染锁定/当前/完成态。
- [ ] 节学习页无 TabBar 且有进度。

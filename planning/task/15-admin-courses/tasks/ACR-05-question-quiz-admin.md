# ACR-05 · 题库与测验管理

## PRD 原文引用

- `03-question-types.md` §17：`content_questions` 字段。
- `04-data-model-api.md` §1.7：`content_quizzes` 字段。
- `CR-FR-007/008/009`：节/章/阶段考结构与通过线。

## 需求落实

- 页面：
  - `/admin/content/courses/questions` 题库列表（筛选 type/track/stage/HSK/status/source）。
  - `/admin/content/courses/questions/:id` 题目编辑。
  - `/admin/content/courses/quizzes` 测验列表。
  - `/admin/content/courses/quizzes/:id` 测验编辑（题目挑选 / 抽样规则）。
- 组件：QuestionListTable、QuestionEditFormDynamic（按 type 切表单）、QuizEditForm、QuestionSelectionPicker、SelectionStrategyEditor、QuestionPreviewPane。
- API：
  - `GET /admin/api/content/courses/questions?type=&track=&stage=&hsk=&status=&page=`
  - `GET/POST/PATCH/DELETE /admin/api/content/courses/questions/:id`
  - `GET/POST/PATCH /admin/api/content/courses/quizzes/:id`
  - `POST /admin/api/content/courses/questions/preview` 预览渲染。

## 状态逻辑

- type 切换时表单自适应（13 种动态字段）。
- 测验 question_count 与 pass_threshold 校验：
  - lesson_quiz: question_count=10 或 12，pass_threshold=60-80。
  - chapter_test: 36，pass_threshold=70-80。
  - stage_exam: 80-150，pass_threshold=75-85。
- 题目预览面板复用 CR-10 题型组件。

## 不明确 / 风险

- 风险：HSK 等级标签可能在非 HSK 题目误显示作为筛选。
- 处理：HSK 筛选只在 track=hsk 时生效；其他 track 题目可按场景标签筛。

## 技术假设

- 题目 source ∈ {ai/human/hsk_real}，UI 区分图标。
- 测验 selection_strategy 用 JSON 编辑器（schema validation）。

## 最终验收清单

- [ ] 题库列表筛选准确，分页顺畅。
- [ ] 13 种题型表单切换无错。
- [ ] 题目预览与前端一致。
- [ ] 测验配置参数校验生效。
- [ ] 题目报错（content_reports）按 question_id 在题库列表显示徽章。

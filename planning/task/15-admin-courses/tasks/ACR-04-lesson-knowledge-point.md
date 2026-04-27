# ACR-04 · 节与知识点管理

## PRD 原文引用

- `04-data-model-api.md` §1.4 lessons + §1.5 knowledge_points。
- `content/course/shared/04-knowledge-point-format.md`：知识点字段固定。

## 需求落实

- 页面：
  - `/admin/content/courses/lessons/:id` 节编辑页（含 12 知识点列表 + 节小测预览）。
  - `/admin/content/courses/knowledge-points/:id` 单知识点详情页（**单独页面，避免长下拉**）。
- 组件：LessonEditForm、LearningObjectivesEditor、KnowledgePointGrid（12 卡片）、KnowledgePointEditForm、KnowledgePointReorderHandle、AudioUploader、ExampleSentenceLinker、KeyPointEditor。
- API：
  - `GET/PATCH /admin/api/content/courses/lessons/:id`
  - `POST /admin/api/content/courses/lessons/:id/publish`
  - `GET/POST/PATCH/DELETE /admin/api/content/courses/knowledge-points/:id`
  - `POST /admin/api/content/courses/lessons/:id/reorder-kpoints`

## 状态逻辑

- 知识点列表分页：每页 12 条（一节恰好 12 个），不超过单页。
- 单知识点编辑跳子页面避免上下滑动疲劳。
- 多语翻译完整度显示徽章（X/N，N=已启用语种数）。
- 拼音 + 拼音声调字段一起编辑；自动校验长度。

## 不明确 / 风险

- 风险：example_sentence_ids 引用 DC 句子表，跨模块依赖。
- 处理：链接器调 `GET /admin/api/content/sentences?keyword=` 选择已存在句子；不允许新建跨模块句子。

## 技术假设

- 自动保存 30s；保留 draft 与 published 双版本。
- 知识点 type 固定 5 类：word/phrase/sentence/grammar/culture。

## 最终验收清单

- [ ] 节编辑页 12 知识点网格（不下拉过长）。
- [ ] 知识点详情页单独子路由。
- [ ] 多语翻译徽章随启用语种动态。
- [ ] 拼音字段保存正确，pinyin_tones 数字声调可选。
- [ ] 重排序写 audit_logs。

# CR-27 · seed JSON Schema 与幂等 upsert

## PRD 原文引用

- `planning/rules.md` §11.3：“所有内容模块的种子 JSON 必须符合下面的统一字段约束……`$schema_version: 1.0`、`module: courses`、`items: [{slug, i18n, tags, media, module_specific}]`。”
- §11.5：“E16 的 LLMFakeAdapter 必须能消费 §11.3 的 JSON Schema……与 `seed:<module>` 命令共用同一套 upsert 逻辑（packages/db/src/seed/upsert.ts）。”

## 需求落实

- Schema 实现：`system/packages/db/src/seed/schemas/courses.schema.ts`（zod）。
- Upsert：`system/packages/db/src/seed/upsert.ts` 提供通用 `upsertCourseTrack/Stage/Chapter/Lesson/KnowledgePoint/Question/Quiz`。
- 幂等键：
  - tracks: `code`
  - stages: `(track_code, stage_no)`
  - chapters: `(track_code, stage_no, chapter_no)`
  - lessons: `(track_code, stage_no, chapter_no, lesson_no)`
  - knowledge_points: `(lesson_slug, kpoint_no)`
  - questions: `(question_external_id)`（用户提供的 stable id）
  - quizzes: `(parent_id, type)`

## module_specific 字段约束

- track: `{code, hsk_only}`。
- stage: `{stage_no, hsk_level_range, prerequisite_stage}`。
- chapter: `{chapter_no, is_free, free_reason}`。
- lesson: `{lesson_no, learning_objectives}`。
- knowledge_point: `{kpoint_no, type, zh, pinyin, pinyin_tones, key_point, example_sentences, tags, hsk_level}`。
- question: `{type, stem_zh, options, correct_answer, explanation, hsk_level, difficulty, source}`。
- quiz: `{type, parent_slug, question_count, pass_threshold, time_limit_seconds, question_external_ids?, selection_strategy?}`。

## 不明确 / 风险

- 风险：question_external_id 可能与生产 UUID 冲突。
- 处理：导入时先按 external_id 查找；存在则 update，不存在则生成 UUID 插入并保留 external_id。

## 技术假设

- `pnpm seed:from-file path/to/courses.json` 复用同一 upsert 逻辑。
- 校验失败时打印行号与字段，整批回滚。

## 最终验收清单

- [ ] zod schema 校验通过/失败有明确报错。
- [ ] 重复运行同一 seed 不报错且无重复。
- [ ] LLMFakeAdapter 调用相同 upsert 路径。
- [ ] `pnpm seed:from-file` 支持单独 courses 部分导入。
- [ ] question_external_id 冲突时正确 update。

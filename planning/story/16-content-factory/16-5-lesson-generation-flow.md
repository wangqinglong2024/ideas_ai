# Story 16.5: 课程节生成工作流（lesson flow）

Status: ready-for-dev

## Story

作为 **课程内容运营**，
我希望 **AI 自动生成单节课程的 10-15 个教学步骤、payload 与 scoring 规则**，
以便 **快速扩充课程库（HSK 1-6 / Daily / Ecommerce / Factory）并保证学习闭环完整**。

## Acceptance Criteria

1. LangGraph DAG：`design_outline → step_designer → payload_builder → scoring_builder → translate → audio → eval`。
2. 输入：`{ track: 'hsk'|'daily'|'ecommerce'|'factory', stage_id, lesson_topic, hsk_level, target_step_count: 10-15, vocab_seed?: string[] }`。
3. 输出：写入 `lessons`（status=`pending_review`）+ `lesson_steps`（10-15 行）+ `lesson_step_translations`（5 语）+ 音频 URL。
4. **step_designer**：Claude，按 E08 step type spec 选择步骤类型组合（vocab_intro / pinyin_match / sentence_listen / dictation / fill_blank / mc / sort / speak_repeat / final_quiz 等）。
5. **payload_builder**：每步骤生成对应 schema 的 payload，使用 16-1 模板中按 step type 匹配的 prompt。
6. **scoring_builder**：每步骤生成评分规则 JSON（per E08 spec），含正确答案 / 部分分 / hints / 容错（拼音大小写、声调标记可选）。
7. **payload schema 校验**：每步骤运行时用 Zod schema 验证，失败 → 回到 payload_builder 节点最多 2 次。
8. **translate**：调用 16-9 翻译节点（5 语，针对 prompts / hints / explanations）。
9. **audio**：调用 16-8 TTS（仅句子 / 单词级 audio fields）。
10. **eval**：16-10 评估器，4 维度（覆盖度 / 难度匹配 / 多样性 / 完整性）综合 ≥ 0.7 通过。
11. 单节成本上限：$0.50；超额停止。
12. 端到端 P95 ≤ 5 分钟。
13. 与 8-2 step type spec 100% 一致；引入新 step type 必须先更 spec。
14. 单元 + 集成测试：fixture（HSK1 stage1 lesson "你好"）端到端成功，DB 写入 12 步骤。

## Tasks / Subtasks

- [ ] **DAG + 节点**（AC: 1, 4-10）
  - [ ] `packages/factory/src/flows/lesson/`
  - [ ] step type → prompt key 映射表
- [ ] **Schema 校验**（AC: 7）
  - [ ] Zod schemas 复用自 `packages/shared/types/lesson-step.ts`
  - [ ] 失败重跑 counter
- [ ] **持久化**（AC: 3）
  - [ ] lessons / lesson_steps / lesson_step_translations
  - [ ] 事务
- [ ] **成本 / 重试**（AC: 11）
- [ ] **测试**（AC: 14）

## Dev Notes

### 关键约束
- step types 严格遵循 E08 / 8-2 spec，禁止"创造"未文档化的类型。
- `vocab_seed` 可指定本节核心词，工作流应优先围绕这些词设计步骤。
- 评分规则：Claude 倾向过严，需 system prompt 明确"接受拼音大小写、声调标记可选、空格容错"。
- 同一节内步骤类型多样性约束：至少 5 种不同 type，避免单一型态。
- HSK 难度匹配：词汇必须在 HSK ≤ level + 1 表内，超出标 warning 由人审决定。
- 与 E07 / E08 步骤进度引擎对齐：scoring 字段名严格按 spec。

### 关联后续 stories
- 8-2 step type spec（依赖）
- 8-8 ten-step components（前端渲染目标）
- 16-9 / 16-8 / 16-10
- 17-7 admin 课程管理，列表入口

### Project Structure Notes
- `packages/factory/src/flows/lesson/graph.ts`
- `packages/factory/src/flows/lesson/nodes/{step-designer,payload-builder,scoring-builder}.ts`
- `packages/factory/src/flows/lesson/payload-schemas.ts`（re-export from shared）

### References
- `planning/epics/16-content-factory.md` ZY-16-05
- `planning/epics/08-courses.md` ZY-8-2
- `planning/spec/06-ai-factory.md` § 6

### 测试标准
- 集成：HSK1 stage1 lesson 1 fixture
- 失败路径：payload schema 验证失败 → 重跑 1 次成功
- 成本：mock 累计 $0.6 → 终止

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

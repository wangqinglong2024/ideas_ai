# CR-26 · 最小开发 seed（≥24 lessons）

## PRD 原文引用

- `planning/rules.md` §11.1：“CR：4 个课程系列（HSK / 日常 / 商务 / 工厂）× 每系列 ≥ 2 stage × 每 stage ≥ 3 lessons = ≥ 24 lessons；每 lesson ≥ 5 题（含 ≥ 3 种题型）。”
- §11.4：“`pnpm seed:<module>` 在干净的 dev 数据库上一次性跑通，零报错。”

## 需求落实

- Seed 文件：
  - `system/packages/db/seed/courses/tracks.json`（CR-01）
  - `system/packages/db/seed/courses/stages.json`（CR-01）
  - `system/packages/db/seed/courses/chapters.json`
  - `system/packages/db/seed/courses/lessons.json`
  - `system/packages/db/seed/courses/knowledge_points.json`
  - `system/packages/db/seed/courses/questions.json`
  - `system/packages/db/seed/courses/quizzes.json`
- 脚本：`pnpm seed:courses` 调用 `system/packages/db/scripts/seed.ts` 的 courses 分支。

## 内容范围

- 4 轨道 × 每轨 2 stage × 每 stage 3 chapters（其中 chapter 1-3 in stage 1 标 is_free=TRUE） × 每 chapter 3 lessons = 72 lessons。
- 每 lesson 5 题 × 360 questions；题型覆盖 ≥ 6 种（Q1/Q2/Q3/Q4/Q6/Q9 至少各 1）。
- 至少 1 套阶段考试（HSK Stage 1）含 10 题。
- TTS 占位音频复用同一 `placeholder-audio.mp3`。

## 不明确 / 风险

- 风险：seed 文件过大不便维护。
- 处理：按 track 拆分子文件夹 `seed/courses/<track>/lessons.json`，运行时合并。

## 技术假设

- 幂等：按 `slug`（lessons）/ `(track,stage,chapter,lesson)` 复合键 upsert。
- JSONB 字段写入走 raw postgres-js（用户记忆 `drizzle-jsonb.md`）。

## 最终验收清单

- [ ] `pnpm seed:courses` 干净库一次跑通。
- [ ] 数据库 lessons ≥ 24（实际 72）。
- [ ] 题型覆盖 ≥ 6 种。
- [ ] HSK Stage 1 阶段考含 10 题。
- [ ] 重复执行 seed 不报错（upsert）。

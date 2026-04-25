# Story 8.1: 课程数据表迁移（tracks / stages / lessons / steps）

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立课程产品的核心表结构（tracks / stages / lessons / steps）并填充 4 条轨道的种子数据**，
以便 **课程列表 / 详情 / 学习页都有数据来源**。

## Acceptance Criteria

1. Drizzle schema `packages/db/schema/courses.ts`：
   - `tracks`：slug (PK) / name_jsonb / description_jsonb / cover / difficulty / total_stages / is_paid。
   - `stages`：id / track_slug / stage_no / name_jsonb / description / total_lessons / unlock_rule。
   - `lessons`：id / stage_id / lesson_no / title_jsonb / summary / total_steps / is_paid / xp_reward。
   - `steps`：id / lesson_id / step_index / step_type / payload_jsonb / kp_id。
2. 4 条轨道 seed：daily / ecommerce / factory / hsk，每条 12 stages。
3. 每条轨道至少 1 个 stage 含 1 节完整课（10 步骤），用于联调（其他可空）。
4. 索引：`stages(track_slug, stage_no)`、`lessons(stage_id, lesson_no)`、`steps(lesson_id, step_index)`。
5. RLS：内容默认 public read，写入仅 admin。
6. 迁移 + seed 可正向 / 反向运行。
7. 类型导出：`Track / Stage / Lesson / Step`。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1,4,7）
- [ ] **Migrations**（AC: 6）
- [ ] **Seed**（AC: 2,3）
  - [ ] 解析 `course/daily/stage-*.md` 等 markdown，转 sql seed
- [ ] **RLS**（AC: 5）

## Dev Notes

### 关键约束
- step.payload 全用 jsonb，由 8-2 step-type-spec 定义 schema。
- name_jsonb 含 4 语种。
- 内容来自 `course/<track>/stage-*.md` 现有素材，需脚本化转换。

### 关联后续 stories
- 8-2 step type spec
- 8-3 课程列表详情 API
- 7-1 enrollments 通过 track_slug+stage_no 软关联

### Project Structure Notes
- `packages/db/schema/courses.ts`
- `packages/db/seeds/courses/*.ts`
- `db/policies/courses.sql`
- `scripts/import-courses-from-md.ts`

### References
- `planning/epics/08-courses.md` ZY-08-01
- `course/<track>/stage-*.md`

### 测试标准
- 单元：schema 编译
- 集成：seed → 4 tracks × 12 stages 完整
- 性能：列表 SQL EXPLAIN 走索引

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

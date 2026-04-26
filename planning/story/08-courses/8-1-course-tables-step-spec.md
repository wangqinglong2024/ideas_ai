# ZY-08-01 · course_* 表 + 步骤类型规范

> Epic：E08 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] schema `zhiyu`：`tracks`、`stages`、`chapters`、`lessons`、`lesson_steps`
- [ ] 索引 + RLS（published 可读）
- [ ] `lesson_steps.step_type` 枚举（10 种）+ Zod payload 规范文档
- [ ] scoring schema 文档（每种 type 独立）
- [ ] 4 轨道（daily/ecommerce/factory/hsk）种子

## 测试方法
- migration 通过
- 文档：`packages/contracts/src/lesson-steps.ts` 包含 10 种 zod schema

## DoD
- [ ] 5 张表 + 10 步骤类型规范

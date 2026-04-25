# Story 7.7: 错题本

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **集中查看所有错题（来自课程 / 游戏 / 阅读），按知识点分组并支持筛选**，
以便 **针对性巩固薄弱环节**。

## Acceptance Criteria

1. `GET /v1/me/mistakes?filter=all|unmastered|recent&group_by=kp|source&page=&size=` 列表。
2. 每条返回：question_payload（截图式还原）、wrong_count、last_seen_at、next_review_at、source 链接。
3. `POST /v1/me/mistakes/:id/redo` 重答接口，正确则触发 SRS 算法（同 7-5）。
4. `DELETE /v1/me/mistakes/:id` 标记 `mastered = true`（不物理删除）。
5. 按知识点分组聚合：返回 `{ kp_id, kp_name, total, unmastered }`。
6. 错题截图：依据 source_type + source_id 重建题面（最低限度 = 题目文本 + 用户答案 + 正确答案）。
7. RLS + 限流（read 60/min）。

## Tasks / Subtasks

- [ ] **API**（AC: 1,2,3,4,5,7）
- [ ] **Reconstruction service**（AC: 6）
  - [ ] `services/mistake-reconstruct.service.ts`
- [ ] **Aggregation**（AC: 5）
- [ ] **测试**

## Dev Notes

### 关键约束
- 重建优先复用原始 step.payload（不要再次访问 LLM），保留答题快照。
- 知识点（kp_id）由 8-2 step-type-spec 预定义。

### 关联后续 stories
- 7-5 SRS 重答联动
- 7-12 学习仪表盘聚合数据

### Project Structure Notes
- `apps/api/src/routes/me/mistakes.ts`
- `apps/api/src/services/mistake-reconstruct.service.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-07

### 测试标准
- 单元：分组聚合
- 集成：redo 链路 / mastered 切换
- 性能：list P95 < 150ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

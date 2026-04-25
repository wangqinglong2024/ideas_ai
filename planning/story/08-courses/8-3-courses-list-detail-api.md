# Story 8.3: 课程列表 / 详情 API

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **浏览所有学习轨道、查看某轨道下的所有阶段与节，并查询某节的步骤明细**，
以便 **在课程页面浏览与挑选**。

## Acceptance Criteria

1. `GET /v1/tracks`：返回 4 条轨道（多语 i18n + cover + difficulty + total_stages + is_paid）。
2. `GET /v1/tracks/:slug`：含轨道 + 全部 stages + 每个 stage 的 lessons 摘要（不含 steps）。
3. `GET /v1/lessons/:id`：含 lesson + steps（按 step_index 升序），鉴权：付费 lesson 未购买仅返回 metadata（payload_jsonb 置空）。
4. 接口默认按用户 i18n header 返回对应语言；缺失回退英文。
5. 性能：tracks list P95 < 80ms（缓存 5 min）；lesson 详情 P95 < 150ms。
6. CDN 友好：tracks list / track 详情 设 `Cache-Control: public, max-age=60`。
7. 与 7-2 enrollments 联动：响应可附 `is_enrolled` 标记（要求登录）。

## Tasks / Subtasks

- [ ] **API 路由**（AC: 1,2,3,7）
  - [ ] `routes/tracks.ts`
  - [ ] `routes/lessons/[id].ts`
- [ ] **i18n**（AC: 4）
- [ ] **缓存**（AC: 5,6）
  - [ ] Redis cache + Cache-Control header
- [ ] **付费墙**（AC: 3）
  - [ ] 调 8-10 paywall 服务

## Dev Notes

### 关键约束
- 列表接口允许匿名访问（无登录），便于 SEO / 落地页预览。
- 详情接口 step.payload 在未购买时置空但保留 step_type / kp_id。
- 不要在此接口直接返回 enrollment 状态（前端调 7-2 GET /me/enrollments 拼合）。

### 关联后续 stories
- 8-5 课程列表页
- 8-6 阶段详情页
- 8-7 节学习页
- 8-10 付费墙

### Project Structure Notes
- `apps/api/src/routes/tracks.ts`
- `apps/api/src/routes/lessons/[id].ts`
- `apps/api/src/services/course.service.ts`

### References
- `planning/epics/08-courses.md` ZY-08-03

### 测试标准
- 单元：i18n 回退
- 集成：付费 / 非付费 lesson 返回差异
- 性能：tracks list P95

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

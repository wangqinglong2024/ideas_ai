# Story 17.9: CMS 发布控制台（v1）+ 工厂占位（v1.5）

Status: ready-for-dev

## Story

作为 **内容主管**，
我希望 **拥有跨内容类型的统一发布控制台**，
以便 **集中查看 5 类内容（文章 / 课程节 / 小说章节 / 词包 / 题库）的状态、多语完整度并一键发布；同时为 v1.5 工厂控制台预留入口**。

## Acceptance Criteria

1. 路由 `/admin/cms`：统一列表（type / title / status / langs / updated / 评分 / actor）。
2. 筛选 type / status / langs / 评分区间 / 日期；排序按 updated desc。
3. **多语对比视图**：单条目展开抽屉，5 语并排显示 + 缺失高亮。
4. **一键发布**：单条 / 批量发布（draft → published），需通过校验：
   - 必填字段完整
   - zh + 至少 1 外语
   - 评分 ≥ 0.7（如有）
5. **撤回**：published → archived 一键。
6. **预览**：每条预览到端用户页。
7. **工厂占位**（v1）：路由 `/admin/factory` 显示卡片
   - 「v1.5 即将上线」+ 计划描述
   - 提供 v1 用的「外部脚本导入工具」链接（17-6/7/8 的导入入口）
8. **工厂控制台**（v1.5）：本 story 在 v1.5 阶段补充：任务列表 / 过滤 / 一键触发（调用 16-4/5/6/7）/ LangSmith 跳转 / 成本评分。
9. **权限**：`cms:read|publish|bulk|factory:read|factory:trigger`。
10. **审计** + e2e。

## Tasks / Subtasks

### v1 阶段（M4-M5）
- [ ] **CMS 列表 API + UI**（AC: 1-6）
  - [ ] 统一查询多张表 union view
- [ ] **工厂占位页**（AC: 7）
- [ ] **权限 + 审计**（AC: 9, 10）

### v1.5 阶段（M+3+）
- [ ] **工厂控制台**（AC: 8）
  - [ ] 任务列表（factory_tasks）+ 触发表单 + LangSmith deep link
  - [ ] 与 16-12 仪表板互链

## Dev Notes

### 关键约束
- 统一列表性能：跨表 union 难直接索引，建议物化视图 `mv_cms_index` 每 5min 刷新；本 story 实现该 mv。
- 批量发布：单事务最多 50 条，超出分批；任一失败原子回滚。
- 工厂占位文案 4 语（与 i18n 接入）。
- 触发工厂任务（v1.5）：调用 16-x 内部 API，要求 idempotency key。

### 关联后续 stories
- 17-6 / 17-7 / 17-8（数据来源）
- 16-1 ~ 16-12（v1.5 联动）

### Project Structure Notes
- `apps/admin/src/pages/cms/`
- `apps/admin/src/pages/factory/Placeholder.tsx`（v1）
- `apps/api/src/routes/admin/cms/*.ts`
- `packages/db/migrations/2026xxxx_mv_cms_index.sql`

### References
- `planning/epics/17-admin.md` ZY-17-09

### 测试标准
- e2e：CMS 列表 → 多语预览 → 一键发布
- 性能：mv 刷新 < 30s
- v1.5 联调：工厂控制台触发工作流

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

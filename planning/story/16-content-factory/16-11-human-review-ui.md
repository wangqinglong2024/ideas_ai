# Story 16.11: 人审 UI（后台编辑器 + 任务队列）

Status: ready-for-dev

## Story

作为 **内容人审 / 编辑**，
我希望 **在 admin 后台拥有任务队列、多语对比编辑器与状态机**，
以便 **审核、修改、打回或废弃 AI 工厂产出，确保最终上线内容达标**。

## Acceptance Criteria

1. 路由 `/admin/factory/review`：左侧任务列表（按 channel / status / SLA / 评分过滤）、右侧编辑器。
2. 任务列表项展示：channel / 主题 / 评分 / 创建时间 / SLA 剩余时间 / 派发人。
3. **派发**：编辑点击「领取」→ 任务 status `assigned` + assignee_id；领取后 4h 未操作自动释放回队列。
4. **编辑器**：
   - 多语 tab（zh / en / vi / th / id），同时显示 evaluator explanation。
   - 句级编辑（article / novel）；词级编辑（wordpack）；步骤编辑（lesson）。
   - 重新触发单步：调用 16-4/5/6/7 的 step API（如 `/replay/polish`）。
   - 修改后 diff 高亮，保存写 audit_logs。
5. **状态机**：`pending_review → assigned → approved / rejected / discarded`；
   - approved → status=`published_ready`，触发 17-9 CMS 发布动作。
   - rejected → 回到 graph 重跑指定节点。
   - discarded → 永久归档，记录原因。
6. **SLA 计时**：标准 SLA 24h；超时 → 颜色红 + 通知频道（飞书 / 邮件）。
7. **评分回写**：编辑保存后允许人工 evaluator 评分（可选），用作 prompt 调优反馈。
8. **键盘快捷键**：`A` approve、`R` reject、`D` discard、`Cmd+S` save、`Tab` 跳到下一句。
9. **权限**：`factory:review` 可领取 / 编辑；`factory:approve` 可最终审批；普通编辑可操作但 final approve 需 reviewer。
10. **批量**：列表多选 → 批量 approve（仅评分 ≥ 0.85 允许）/ 批量 discard。
11. **可观察**：每次操作写 audit_logs + PostHog 事件。
12. e2e 测试：领取 → 编辑 → 拒绝重跑 → 再次审批通过 → 发布到 CMS。

## Tasks / Subtasks

- [ ] **任务队列 API**（AC: 1-3, 6）
  - [ ] `apps/api/src/routes/admin/factory/review.ts`
  - [ ] 任务释放 cron（每分钟扫描超期 assigned）
- [ ] **编辑器 UI**（AC: 4, 8）
  - [ ] Monaco 多 tab + diff
  - [ ] 句级 / 词级 / 步骤级组件
- [ ] **状态机 + 发布**（AC: 5, 10）
- [ ] **RBAC + 审计**（AC: 9, 11）
- [ ] **SLA 通知**（AC: 6）
- [ ] **测试**（AC: 12）

## Dev Notes

### 关键约束
- 编辑器保存必须基于乐观并发（factory_tasks.version），避免双人覆盖。
- 重跑节点：调用 graph `resume(threadId, fromNode)`，由 16-2 提供的 API 包装。
- 任务释放 cron 与 BullMQ 队列调度一起跑，避免频繁查询。
- audit_logs：actor / before / after / reason，最少 1 行/操作。
- discarded 任务 30d 后归档冷库；本 story 仅写状态。

### 关联后续 stories
- 16-1 ~ 16-10
- 17-9 CMS 控制台（联通发布）
- 17-2 admin 登录 / RBAC
- 18-5 audit logs

### Project Structure Notes
- `apps/admin/src/pages/factory/review/`
  - `Queue.tsx` / `Editor.tsx` / `LangTabs.tsx` / `StepReplay.tsx`
- `apps/api/src/routes/admin/factory/review.ts`
- `apps/api/src/jobs/factory-task-release.ts`

### References
- `planning/epics/16-content-factory.md` ZY-16-11
- `planning/prds/14-content-factory/` UX § 8

### 测试标准
- e2e Playwright：完整审批流
- 并发：两编辑同时改 → 第二人收到冲突
- SLA：mock 24h 超时 → 通知触发

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

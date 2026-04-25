# Story 7.11: HSK 自动评测 stub（基于学习数据）

Status: ready-for-dev

## Story

作为 **系统**，
我希望 **基于用户日常学习数据动态估算其 HSK 水平**，
以便 **在用户不参与自评的情况下提供合理推荐与内容难度调节**。

## Acceptance Criteria

1. 离线 cron 每 24h 扫描每用户最近 30 天学习数据：
   - 答题正确率分级（HSK1-6 各级别）
   - 接触词汇覆盖率
   - 完成节数加权
2. 输出 `hsk_auto_level (1-6) + confidence (0-1)`，写入 `users.profile.hsk_auto_level`。
3. MVP 实现为简单加权公式（**stub**），不引入 ML：`level = round(weighted_avg(level_correct_rate * coverage))`。
4. 当 hsk_auto_level 与 hsk_self_level 偏差 ≥ 2 时，仪表盘提示「建议重新评测」。
5. 仅作展示与提示，**不**自动调整学习轨道。
6. 提供 admin 接口 `GET /v1/admin/hsk-auto/:user_id` 查看明细。

## Tasks / Subtasks

- [ ] **Cron job**（AC: 1）
  - [ ] `apps/worker/src/jobs/hsk-auto.ts`
- [ ] **Service**（AC: 2,3）
  - [ ] `services/hsk-auto.service.ts`
- [ ] **UI hint**（AC: 4）
  - [ ] 仪表盘卡片（在 7-12 引用）
- [ ] **Admin**（AC: 6）

## Dev Notes

### 关键约束
- 是 stub：算法可后续替换，不要把判断逻辑分散到多处，集中在 `hsk-auto.service`。
- confidence 用以未来切换不同内容侧重，MVP 仅记录。

### 关联后续 stories
- 7-12 仪表盘消费
- E16 内容工厂未来可基于此预生成内容

### Project Structure Notes
- `apps/worker/src/jobs/hsk-auto.ts`
- `apps/api/src/services/hsk-auto.service.ts`

### References
- `planning/epics/07-learning-engine.md` ZY-07-11

### 测试标准
- 单元：加权公式
- 集成：cron 扫单用户产出

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

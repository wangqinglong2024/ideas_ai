# ZY-07-02 · 步骤推进 + 节完成结算

> Epic：E07 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] POST `/api/v1/lessons/:id/steps/:n/answer`：根据 step type 校验、计算正确率、错题入 `mistakes`、更新 `lesson_progress`
- [ ] 节完成 → `learningEngine.completeLesson`：计算 XP / ZC、写 `coins_ledger`（接 E12 `economy.issue`）
- [ ] 解锁下一节（更新 `enrollments.next_lesson_id`）
- [ ] 推荐复习 / 游戏（hint 字段）
- [ ] 幂等：相同 (user, lesson, step, idem_key) 重复请求不重复发奖

## 测试方法
- 集成：模拟 10 步骤完成 → 验证 XP / ZC / 解锁
- 重试请求：奖励不翻倍

## DoD
- [ ] 全链路通；MCP Puppeteer 跑完一节

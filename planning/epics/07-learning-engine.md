# Epic E07 · 学习引擎（Learning Engine）

> 阶段：M2 · 优先级：P0 · 估算：4 周
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)

## 摘要
课程 / 阅读 / 游戏共用的学习引擎：进度跟踪、SRS 复习、生词与错题、XP / 等级 / 连续学习、HSK 自评。

## 范围
- 学习状态机
- 进度持久化（Supabase）
- SRS 复习（SM-2 简化）
- 生词本 / 错题本
- XP / 等级 / streak
- HSK 自评（v1）+ 自动评估占位（未来）
- 个人学习数据看板

## Stories（按需 7）

### ZY-07-01 · enrollments / progress / mistakes 表 + 报名 API
**AC**
- [ ] schema `zhiyu`：`enrollments`、`lesson_progress`、`mistakes`、`vocab_items`
- [ ] RLS：本人可读写
- [ ] POST/GET/DELETE `/api/v1/enrollments`
**估**：M

### ZY-07-02 · 步骤推进 + 节完成结算
**AC**
- [ ] POST `/api/v1/lessons/:id/steps/:n/answer`：答案校验、正确率、错题入 `mistakes`、更新 `lesson_progress`
- [ ] 节完成：计算 XP / ZC，写 `coins_ledger`（接 E12），解锁下一节
- [ ] 推荐复习 / 游戏（仅返回 hint，不强制）
**估**：L

### ZY-07-03 · SRS 复习引擎
**AC**
- [ ] SM-2 简化算法；间隔 1 / 3 / 7 / 14 / 30 天
- [ ] cron（BullMQ repeatable job）：每日生成复习推荐
- [ ] 错题自动加入复习队列
**估**：L

### ZY-07-04 · 生词本 + 错题本
**AC**
- [ ] 生词：来源（文章 / 课程 / 游戏）、复习入口
- [ ] 错题：按来源 / 类型分组、重做模式、掌握后自动移出
**估**：M

### ZY-07-05 · XP / 等级 / streak
**AC**
- [ ] XP 公式：每节 / 每篇 / 每游戏；等级表 1-100
- [ ] streak 日历视图、每月 1 次免费冻结、本地通知激励（通过 supabase-realtime 推到客户端）
- [ ] 升级动画（FE 组件）
**估**：M

### ZY-07-06 · HSK 自评（v1）
**AC**
- [ ] 注册引导问卷（10 题）；推荐起始等级
- [ ] 个人页可重测
- [ ] 自动评估留接口占位（数据列收集：答题正确率 / 时长 / 词汇）
**估**：S

### ZY-07-07 · 学习数据看板（个人）
**AC**
- [ ] 周 / 月报表：时长 / XP / 完成数 / 与上周对比
- [ ] 数据来自 `lesson_progress` + `coins_ledger` 聚合 SQL（直接 supabase RPC）
**估**：M

## DoD
- [ ] 进度 / XP / streak 全跑通；MCP Puppeteer 跑完整：报名→步骤→完成→升级动画
- [ ] SRS 推荐有效；BullMQ 队列在 zhiyu-worker 内每日触发
- [ ] 数据看板在 FE 渲染清晰

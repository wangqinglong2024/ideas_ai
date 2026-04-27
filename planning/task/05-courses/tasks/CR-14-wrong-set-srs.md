# CR-14 · 错题集入库 + SRS 集成契约

## PRD 原文引用

- `CR-FR-012`：“存储：`learning_wrong_set` 表；入库时机：节小测错（即时）、章测错（提交后批量）、阶段考错（提交后批量）、游戏错（即时，详见 GM）；去重：同一 question_id 重复错只保留最新。”
- `04-data-model-api.md` §4.1：“答错时立即 INSERT learning_wrong_set；同时调 SRS 服务（LE 模块）：把 question_id 加入复习队列；FSRS-5 状态：new → learning → review。”
- `04-data-model-api.md` §4.2：“用户在温故知新中答对 2 次 → is_resolved=TRUE。”

## 需求落实

- 数据：`learning_wrong_set`（CR-03）+ LE 模块 `srs_states`（独立任务）。
- API 内部契约：
  - `POST /internal/srs/queue.add` Body `{user_id, question_id, source}`。
  - `POST /internal/srs/queue.resolve` Body `{user_id, question_id}`。
  - 由课程 backend 在 quiz submit 后调用；游戏 backend 在错题事件后调用。
- 写入路径：
  1. 评分 → 错题列表
  2. `INSERT ... ON CONFLICT (user_id, question_id) DO UPDATE SET wrong_count = wrong_count+1, last_wrong_at = NOW(), is_resolved = FALSE`
  3. 异步 enqueue SRS

## 状态逻辑

- `is_resolved=TRUE` 触发：温故知新答对 2 次 OR 后续节小测/章测中同题答对。
- `is_resolved` 状态变化写 audit（`learning_wrong_resolved` 事件埋点）。

## 不明确 / 风险

- 风险：游戏 / 课程是否共用 question_id 命名空间？
- 处理：game wordpack 题目独立 `game_questions` 表（GM 模块）；错题集仅汇总 `content_questions.id`，游戏错题以转换后的等价 question_id 入库。

## 技术假设

- LE 模块本期未实施，先实现 `LeFakeAdapter` 接收 enqueue/resolve 调用并落 log。
- 错题集 GET 接口 `GET /api/learn/wrong-set?source=...&page=` 已包含在 CR-19 / 学习报告。

## 最终验收清单

- [ ] 节小测错 2 题 → 错题集出现 2 行（去重）。
- [ ] 同题第二次错 → wrong_count=2，仍 1 行。
- [ ] 章测/阶段考错题批量入库。
- [ ] 后续节小测同题答对 → is_resolved=TRUE。
- [ ] LeFakeAdapter 收到 enqueue/resolve 调用 log。

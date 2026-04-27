# CR-12 · 章测 36 题流程

## PRD 原文引用

- `CR-FR-008`：“结构：36 题（节小测抽样 + 新综合题）；行为：一次完成、时间限制 60 分钟（可暂停 1 次）、答题完整后才出结果、错题入 SRS；通过标准：≥ 70% 标章完成；奖励：知语币 30 + 章成就徽章。”
- `03-question-types.md` §15.2：18 题节小测抽样 + 18 题新综合。

## 需求落实

- 页面：`/learn/:track/:stage/:chapter/test`。
- 组件：ChapterTestSession、QuestionPager（36 题翻页）、Timer60Min、PauseButton（限 1 次）、ChapterTestResult、AchievementBadge。
- API：
  - `GET /api/learn/quizzes/:chapter_quiz_id`（题目静态/动态抽样）。
  - `POST /api/learn/quizzes/:chapter_quiz_id/submit`。
- 抽样：后端按 `selection_strategy` 实时组卷（18 抽样 + 18 综合），同 user 同章已抽过的题在重做时重新抽。

## 状态逻辑

- 暂停：仅允许一次；暂停时计时停止；恢复后继续；暂停超过 24h 视作放弃，重新开始。
- 时间到自动提交当前答案；未答题计为错。
- 通过 70% → `learning_progress(scope_type='chapter', status='completed')`，奖励 30 知语币 + 章徽章 `chapter:<id>:passed`。
- 错题入 `learning_wrong_set` source=`chapter_test`。

## 不明确 / 风险

- 风险：抽样可能与节小测最近做过的题完全重叠。
- 处理：抽样优先选择用户最近 7 天未做过的题；不足时回退随机。

## 技术假设

- Timer60Min 走服务端时间戳锚定，前端只展示；防止用户调本地时间作弊。
- Pause 状态 server-side 持久化在 `learning_quiz_attempts.metadata.pause`。

## 最终验收清单

- [ ] 36 题中 18 节小测抽样 + 18 综合，比例正确。
- [ ] 暂停 1 次后第二次点暂停按钮 disabled。
- [ ] 时间到自动提交，未答题计错。
- [ ] 通过 70% 写章 completed + 30 知语币 + 章徽章。
- [ ] 错题入 SRS 队列（source=chapter_test）。

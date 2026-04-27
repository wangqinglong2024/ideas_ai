# CR-11 · 节小测 10 题流程

## PRD 原文引用

- `CR-FR-007`：“结构：10 题（10 类题型混合）；行为：答题立即反馈、答错可重试（最多 2 次）、完成后展示得分 + 错题列表、错题入 SRS；通过标准：≥ 60% 即标记节完成；奖励：知语币 5-15（按得分）。”
- `03-question-types.md` §15.1：题型分布建议（Q1-Q3 4 题、Q4/Q6 2 题、Q7/Q8 2 题、Q9/Q10 2 题）。
- `content/course/00-index.md`：节小测 12 题/75% 的内容版口径（与 PRD 不一致，由 CR-13 协调）。

## 需求落实

- 页面：`/learn/:track/:stage/:chapter/:lesson/quiz`。
- 组件：QuizSession、QuestionCarousel、AnswerFeedback、RetryButton、QuizResultPanel、WrongQuestionList、CoinReward。
- API：
  - `GET /api/learn/quizzes/:quiz_id` 返回题目（不含答案）。
  - `POST /api/learn/quizzes/:quiz_id/submit` Body `{responses, duration_seconds}`，返回得分 / 错题 / 解释。
- 数据：写 `learning_quiz_attempts`、错题写 `learning_wrong_set`。

## 状态逻辑

- 题量：MVP 走 PRD 10 题；后台可配置切到内容版 12 题（CR-13）。
- 即时反馈：每题提交后立即返回对错；错可重试 2 次（每次仍记录 attempt 中）。
- 通过线：60%（MVP）；后台可改 75%（内容版）。
- 完成后写 `learning_progress(scope_type='lesson', status='completed', progress_pct=100)`。
- 知语币奖励：得分 60-69→5、70-89→10、90-100→15；通过 EC 模块 `economy.grant`。

## 不明确 / 风险

- 风险：重试 2 次后是否记录最终对错？
- 处理：以最终一次答案计入 `learning_quiz_attempts.question_responses[i].is_correct`；错题集只在所有重试后仍错时入库。

## 技术假设

- 题目数据在前端只缓存当前节小测会话；不可被预拉取作弊。
- 题目顺序由 backend 决定，前端不重排。

## 最终验收清单

- [ ] 节小测 10 题混合题型（覆盖 Q1-Q10 至少 6 种）。
- [ ] 即时反馈出现在每题提交后 < 200ms。
- [ ] 重试 2 次后仍错才入错题集。
- [ ] 通过 60% 写 lesson completed + 知语币到账。
- [ ] 提交前不可见 correct_answer（XHR 检查）。

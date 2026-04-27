# CR-03 · 学习进度 / 测验记录 / 错题集 / 报名 / 购买模型 + RLS

## PRD 原文引用

- `planning/prds/03-courses/04-data-model-api.md` §1.8 `learning_progress`、§1.9 `learning_quiz_attempts`、§1.10 `learning_wrong_set`、§1.11 `user_track_enrollments`、§1.12 `user_stage_purchases`。
- `CR-FR-011`：“知识点切换：1s 防抖后写；节小测完成：立即写。”
- `CR-FR-012`：“同一 question_id 重复错只保留最新。”

## 需求落实

- 数据表：`learning_progress`、`learning_quiz_attempts`、`learning_wrong_set`、`user_track_enrollments`、`user_stage_purchases`。
- RLS：全部启用 `policy USING (user_id = auth.uid())`。
- 索引：
  - `idx_progress_user(user_id, scope_type)`。
  - `idx_attempts_user_quiz(user_id, quiz_id, attempt_no)`。
  - `idx_purchases_user(user_id, status)`。
- 唯一约束：`(user_id, scope_type, scope_id)`、`(user_id, question_id)`、`(user_id, track_id)`、`(user_id, stage_id, purchase_type)`。
- API：详见 CR-15、CR-19、CR-20、CR-29。

## 字段细则

- `learning_progress.scope_type ∈ {'track','stage','chapter','lesson','knowledge_point'}`。
- `learning_progress.status ∈ {'not_started','in_progress','completed','skipped'}`。
- `learning_quiz_attempts.question_responses` JSONB：`[{question_id, answer, is_correct, time_ms}]`，**包含 is_correct**，但前端 GET 时不可见（响应裁剪）。
- `learning_wrong_set.source ∈ {'lesson_quiz','chapter_test','stage_exam','game','review'}`。
- `user_stage_purchases.purchase_type ∈ {'single_stage','nine_pack','membership','manual_grant'}`。
- `expires_at`：单段/9 段为 NULL（永久），membership 写入到期时间。

## 不明确 / 风险

- 风险：`user_stage_purchases.UNIQUE(user_id, stage_id, purchase_type)` 不允许同 stage 同类型多次购买，但跨级 9 段全包按 track 聚合需要单独逻辑。
- 处理：9 段全包写入 `track_id` 列（schema 增加），并以 `(user_id, track_id, 'nine_pack')` 唯一；与原 UNIQUE 共存。
- 风险：membership 不挂任何 stage_id，需要允许 `stage_id NULL` 或单独表。
- 处理：单独 `user_subscriptions` 表（PY 模块拆分），本任务在 schema 注释中链接。

## 技术假设

- `learning_progress` 写路径：客户端 1s 防抖 + 服务端按 `(user_id, scope_type, scope_id)` upsert。
- 错题去重逻辑用 `INSERT ... ON CONFLICT (user_id, question_id) DO UPDATE SET wrong_count = wrong_count + 1, last_wrong_at = NOW()`。

## 最终验收清单

- [ ] 5 张表 migrate 通过，索引/唯一约束/RLS 全部生效。
- [ ] 用户 A 的进度记录通过 RLS 对用户 B 不可见。
- [ ] 节小测 3 次答错同题，`learning_wrong_set.wrong_count=3` 而非插入 3 行。
- [ ] 跨设备登录后 `learning_progress` 立即拉到最新。
- [ ] `user_stage_purchases` 写入 `manual_grant` 走 `admin_audit_logs`。

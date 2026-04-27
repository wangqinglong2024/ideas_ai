# CR-05 · 欢迎引导（学习目标 / 当前水平 / 推荐轨道）

## PRD 原文引用

- `CR-FR-001`：“Step 1：选学习目标（HSK 备考 / 工作 / 兴趣）；Step 2：选当前水平（零基础 / HSK 1-3 / HSK 4-6 / HSK 7+）；Step 3：系统推荐 1-2 轨道 + 起始阶段；Step 4：用户确认 / 调整。可跳过：是，跳过则进 dashboard 让用户自选。”

## 需求落实

- 页面：`/onboarding/courses`（首登注册后弹）。
- 组件：GoalPicker、LevelPicker、TrackRecommendationCard、ConfirmTrackList、SkipOnboardingButton。
- API：
  - `POST /api/learn/onboarding/recommend`：`{goal, level}` → `{tracks: [{code, stage_no, reason}]}`。
  - `POST /api/learn/onboarding/confirm`：`{tracks: [{code, stage_no}]}` → upsert `user_track_enrollments`。
- 状态逻辑：
  - `users.metadata.onboarded_courses=true` 阻止重复弹。
  - 跳过 → `users.metadata.onboarded_courses='skipped'`，dashboard 顶部展示“完成引导”CTA。

## 推荐算法

- `goal=hsk` → 强制 HSK 轨道；按 level 映射 stage：zero→S1，HSK1-3→S3，HSK4-6→S5，HSK7+→S7。
- `goal=work` → 推荐 ec + factory 各 1 条，stage 默认 S2。
- `goal=interest` → 推荐 daily，stage 默认 S2；可叠加任意一轨。
- 用户确认前可手动调整 stage_no（≥1 且 ≤12）。

## 不明确 / 风险

- 风险：用户在跳过后无 enrollment，dashboard 无内容可展示。
- 处理：跳过后 dashboard 显示 4 张轨道卡片让用户手动报名，CTA 文案“开始学习”。

## 技术假设

- 推荐算法在 backend 实现，便于后续 AB 测试与策略调整。
- 多轨道并行：用户可一次选择 ≥ 2 个轨道入学（与 `CR-FR-017` 一致）。

## 最终验收清单

- [ ] 新用户首登 → 进入 `/onboarding/courses`，3 步可达推荐结果。
- [ ] 不同 goal/level 组合返回不同推荐组合（≥ 4 组合验证）。
- [ ] 用户确认后 `user_track_enrollments` 写入，dashboard 显示对应卡片。
- [ ] 跳过后 dashboard 顶部仍可重新触发引导。
- [ ] 已 onboarded 用户不再二次弹引导。

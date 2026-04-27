# CR-23 · 切换轨道与多轨道并行

## PRD 原文引用

- `CR-FR-017`：“位置：dashboard tab + 设置；多轨道并行：用户可同时学多轨道（不限）。”
- `content/course/00-index.md`：“多轨可并行学习。”

## 需求落实

- 组件：TrackSwitcherTabs、AddTrackButton、SettingsTrackPicker。
- API：
  - `POST /api/learn/enrollments` Body `{track_code}` upsert `user_track_enrollments`。
  - `DELETE /api/learn/enrollments/:track_code` 取消报名（保留进度）。
  - `GET /api/me/preferences/last_active_track`。

## 状态逻辑

- Dashboard tab 顺序按 last_active_at DESC。
- “+ 添加轨道”按钮显示未报名的 track。
- 取消报名不删进度，仅隐藏 tab；可随时重新报名。
- 拼音入门不计入 track 切换。

## 不明确 / 风险

- 风险：用户报名 4 轨可能进度分散。
- 处理：dashboard 显示“今日推荐：从 X 轨道继续”，引导聚焦。

## 技术假设

- last_active_track 来源：最近一次 `learning_progress` 写入对应的 track。

## 最终验收清单

- [ ] 用户报名 ec + hsk，dashboard 出现 2 个 tab。
- [ ] 切换 tab 后 dashboard 数据切换 < 200ms。
- [ ] 取消报名后 tab 消失，重新报名后恢复。
- [ ] 多轨进度互不干扰。
- [ ] last_active_track 自动更新。

# CR-16 · 学习时长统计 5s 心跳

## PRD 原文引用

- `CR-FR-016`：“算法：用户在节学习页 / 测验页 时长累计（间隔 5 秒检查活跃）；展示：今日 / 本周 / 累计；奖励：日 30 分钟 → 知语币 +10。”
- `CR-AC-017`：“5s 心跳准确；日 30min → +10 币。”

## 需求落实

- 数据表：`learning_sessions(id, user_id, scope_type, scope_id, started_at, last_heartbeat_at, duration_seconds)`。
- API：
  - `POST /api/learn/sessions/heartbeat` Body `{session_id?, scope_type, scope_id, active}` → 返回 `{session_id, accumulated_seconds, today_seconds, week_seconds}`。
  - `POST /api/learn/sessions/end` 显式结束（路由切换 / 关闭页签）。
- 客户端：`useLearningHeartbeat` Hook，节学习页 + 测验页 mount 时启动 5s setInterval；页面隐藏 (`visibilitychange`) 暂停。
- 经济联动：当 today_seconds 跨过 1800s 时调 `economy.grant({coins: 10, reason:'daily_30min'})`，每日仅一次（去重 key=`daily_30min:<user_id>:<yyyy-mm-dd>`）。

## 状态逻辑

- 活跃判定：心跳间隔 ≤ 10s + active=true 才计入。
- 不活跃：60s 无心跳自动结束 session。
- 显示：dashboard `weekly_study_minutes` 来自 sessions 聚合。

## 不明确 / 风险

- 风险：用户在多设备同时学习。
- 处理：sessions 按设备 fingerprint 区分；同 user 多 session 时长 union 去重时间窗（避免 2x 计数）。

## 技术假设

- 心跳 payload 极轻 (~80 bytes)，对网络无显著影响。
- 客户端使用 `BroadcastChannel` 跨标签页协调，避免单设备多标签页重复计时。

## 最终验收清单

- [ ] 节学习页停留 30 分钟 → today_seconds ≥ 1800，奖励 +10 币。
- [ ] 同日多次跨过 30 分钟仅奖励一次。
- [ ] 页面隐藏 60s 后 session 自动结束。
- [ ] 多设备并行不重复计时（按时间窗 union）。
- [ ] dashboard 周柱状图与 sessions 聚合一致。

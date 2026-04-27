# CR-15 · 学习进度同步与跨设备恢复

## PRD 原文引用

- `CR-FR-011`：“存储：`learning_progress` 表；同步频率：知识点切换 1s 防抖后写、节小测完成立即写、章测/阶段考立即写；跨设备：登录后立即拉取最新。”
- `5.3 错误处理`：“网络中断时自动暂存到 IndexedDB；重连后批量同步。”
- `CR-AC-010`：“同设备 1s 内同步；跨设备登录立即拉最新。”

## 需求落实

- API：
  - `POST /api/learn/progress.upsert` Body `{scope_type, scope_id, status, progress_pct, last_active_at}`。
  - `GET /api/learn/progress?scope_type=&scope_id=` 单条或批量。
  - `GET /api/learn/progress/snapshot` 返回所有进行中 lesson + chapter + stage 摘要（用于跨设备）。
- 数据：`learning_progress`（CR-03）。
- 客户端：IndexedDB store `learning_progress_pending`，断网时入队，重连 flush。

## 状态逻辑

- 防抖：知识点 viewed 1s 防抖；其它（lesson_complete/chapter_complete/quiz_submit）立即。
- 批量：客户端可一次提交 ≤ 50 条 progress 事件；超出分批。
- 冲突：服务端以 `last_active_at` 较新为准（`COALESCE(EXCLUDED.last_active_at, OLD.last_active_at)`）。

## 不明确 / 风险

- 风险：离线状态下答完节小测，online 后需保留得分。
- 处理：quiz_attempts 也写 IndexedDB；online 时 POST 给后端，得分以服务端重新计算为准（防作弊）。

## 技术假设

- IndexedDB 队列容量 ≤ 1000 条；超出旧的 LRU 删除。
- 客户端心跳 30s 拉一次 `/snapshot` 同步多设备。

## 最终验收清单

- [ ] 浏览知识点 → 1s 后 progress 写入数据库。
- [ ] 离线作答节小测 → 联网后批量同步成功。
- [ ] 设备 A 学到 lesson 5，设备 B 登录立即拉到 last_active=lesson5。
- [ ] IndexedDB 队列断电恢复后仍可 flush。
- [ ] 服务端 last_active_at 始终单调递增。

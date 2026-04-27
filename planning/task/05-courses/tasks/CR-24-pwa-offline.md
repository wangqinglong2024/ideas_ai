# CR-24 · PWA 离线缓存（30 天已学节）

## PRD 原文引用

- `5.2 离线支持（PWA）`：“已学过的节缓存（30 天）；离线可继续学习；联网后自动同步进度。”
- `CR-NFR-002`：“PWA 缓存已学节（30 天）；离线可学已缓存内容；联网后批量同步。”

## 需求落实

- ServiceWorker：注册路径 `/sw.js`；策略：
  - `/api/learn/lessons/:id` → CacheFirst + NetworkFallback，TTL 30 天。
  - `/api/learn/quizzes/:id` → NetworkOnly（不缓存防作弊）。
  - 静态资源 → StaleWhileRevalidate。
- IndexedDB：`learning_progress_pending`（CR-15）、`learning_quiz_attempts_pending`、`learning_sessions_pending`。
- Workbox 配置：`system/apps/web/src/sw/sw.ts`。

## 状态逻辑

- 缓存命中：节内容、知识点、TTS 音频（占位也缓存）。
- 缓存淘汰：30 天 LRU；总容量 ≤ 200 MB。
- 离线 UI：顶部 banner “离线模式：可学已缓存节，进度将在联网后同步”。

## 不明确 / 风险

- 风险：节小测离线作答可能被本地篡改。
- 处理：作答 payload 写 IndexedDB；联网后服务端用题库重新评分（不信任本地分数）。

## 技术假设

- 测验题目不缓存：每次 `GET /api/learn/quizzes/:id` 必须 NetworkOnly。
- TTS 占位音频统一缓存名 `placeholder-audio.mp3`。

## 最终验收清单

- [ ] 离线下已学节可继续学习。
- [ ] 节小测在离线状态下作答 → 联网后服务端重新评分 + 进度同步。
- [ ] 缓存超 30 天自动淘汰。
- [ ] Workbox 注册成功，DevTools 可见 SW。
- [ ] 离线 banner 在断网时显示。

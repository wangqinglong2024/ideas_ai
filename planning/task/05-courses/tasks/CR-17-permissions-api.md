# CR-17 · 课程权限计算 API 与缓存

## PRD 原文引用

- `04-data-model-api.md` §2.2 `GET /api/learn/permissions`：“查询参数：track_code, stage_no, chapter_no?, lesson_id?；检查用户对课程节点的访问权限；返回：{has_access, reason: 'free_chapter'|'purchased_stage'|'membership'|'manual_grant'|'paywall', expires_at}。”
- §3 权限检查算法：免费试学章 → 会员 → 单段 → 9 段 → paywall。
- §3 备注：“购买不检查 prerequisite_stage，仅用于学习建议与 UI 提示；用户可跨级购买任意阶段。”

## 需求落实

- API：
  - `GET /api/learn/permissions?track_code=hsk&stage_no=1&chapter_no=4`。
  - `GET /api/learn/permissions/batch` Body `{nodes: [...]}` 批量。
- 实现：`canAccessCourseNode(userId, node)`，按算法依次校验。
- 缓存：
  - 用户级 5 min（Redis key `perm:<user_id>:<scope>`）。
  - 任一 `user_stage_purchases` 写入 → 失效该 user 缓存。
  - 任一 `user_subscriptions` 写入 → 失效该 user 缓存。
  - 后台 `manual_grant` → 失效。

## 状态逻辑

- reason 优先级：free_chapter > membership > nine_pack > purchased_stage > manual_grant > paywall。
- expires_at：membership 写入到期时间；其他 NULL（永久）。
- 游戏模块复用：GM 调用 batch 接口聚合用户已解锁词包范围。

## 不明确 / 风险

- 风险：缓存失效不彻底导致刚购买仍被拦。
- 处理：购买成功事件写入消息队列 → invalidator 立即删 Redis；客户端在购买成功回调强制 refetch。
- 风险：允许跨级购买可能让用户买了 Stage 9 却卡在 Stage 5 的章测前置 UI 提示上。
- 处理：`prerequisite_stage` 仅返回 `advisory: true`，不阻塞访问。

## 技术假设

- 权限计算耗时 < 50ms（Redis 命中），未命中 < 200ms（DB 查询）。
- batch 接口最大 100 个 node。

## 最终验收清单

- [ ] 未付费用户 HSK Stage 1 章 1-3 = `free_chapter`，章 4 = `paywall`。
- [ ] 单段购买后立即可访问该 stage 的全部章。
- [ ] 月会员到期后自动转 `paywall`。
- [ ] 后台 `manual_grant` 写入 5s 内生效。
- [ ] 跨级购买 Stage 9 不需先完成 1-8。

# Story 11.3: 章节内容 API + 付费校验

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **暴露章节内容 API 并在返回前完成付费 / VIP 校验**，
以便 **前端阅读器一次拿到合法内容或付费墙提示**。

## Acceptance Criteria

1. `GET /v1/novels/:slug/chapters/:n` 返回 `{ chapter_meta, content?: { sentences[...] }, locked: boolean, lock_reason?: 'free_quota' | 'paid' | 'vip_required' }`。
2. 解锁规则（按优先级）：
   - 用户拥有有效 VIP 订阅 → 全免（content 返回）。
   - 该章 `is_free = true` 或 `chapter_no <= novels.free_chapters_count` → 免费返回。
   - 用户已购买"整本订阅"（E12 `novel_full_unlock` 商品）→ 返回。
   - 用户已购买"单章解锁" → 返回。
   - 否则 `locked: true` + `lock_reason='paid'` + `price_coins`。
3. 解锁判定接 E12 知语币流水查询（hash 索引）；接 E13 订阅状态查询。
4. 性能：解锁判定 P95 < 80ms（包含订阅查询）。
5. 内容压缩：返回前对 `sentences` jsonb 做 brotli/gzip（HTTP 层）。
6. 速率限制：单 IP/用户 60 req/min。
7. 错误码：404 / 403（archived）/ 401（VIP 章未登录但要 vip_required 提示）。
8. OpenAPI 文档同步。

## Tasks / Subtasks

- [ ] **路由 + 校验链**（AC: 1,2,3,7）
  - [ ] `apps/api/src/routes/novels.chapter.ts`
  - [ ] `services/novel-access.ts`：封装解锁判定函数，便于测试
- [ ] **缓存**（AC: 4,5）
  - [ ] 内容缓存 5min；解锁判定 30s 用户级缓存
- [ ] **限流**（AC: 6）
  - [ ] Redis token bucket
- [ ] **集成 E12 / E13**（AC: 2,3）
  - [ ] 调用 `getCoinsPurchases(userId, novelId, chapterNo)` / `hasActiveVip(userId)`
- [ ] **测试**
  - [ ] 单元：5 种解锁路径
  - [ ] e2e：付费墙触发 / VIP 全免

## Dev Notes

### 关键约束
- 解锁判定函数独立纯函数，便于回归。
- 锁定响应也要带 `chapter_meta`（章节标题等）以便前端付费墙渲染。

### Project Structure Notes
- `apps/api/src/routes/novels.chapter.ts`
- `apps/api/src/services/novel-access.ts`

### References
- [Source: planning/epics/11-novels.md#ZY-11-03]
- [Source: planning/epics/12-economy.md]
- [Source: planning/epics/13-payment.md]

### 测试标准
- 单元 / 集成 / 限流压测

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

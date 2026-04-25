# Story 8.10: 付费墙（节级 / 阶段级解锁）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **免费体验前 N 节，然后在付费节看到付费墙，可购买单节 / 整阶段 / 整轨道 / 会员通行证**，
以便 **付费用户可顺畅升级，未付费用户清晰看到价值**。

## Acceptance Criteria

1. 表 `course_purchases`：id / user_id / sku_type(lesson|stage|track|pass) / sku_id / purchased_at / expires_at(nullable for non-pass)。
2. 后端 `GET /v1/lessons/:id/access` 返回 `{ allowed, paywall_offer? }`。
3. 8-3 / 8-4 接口在内部调用 access service 决定 payload 是否返回。
4. 前端拦截 lesson 进入：unlocked → 直接进；locked → 跳付费墙页。
5. 付费墙页 `app/paywall/[lessonId].tsx`：展示 4 种 SKU 价格、当前优惠、对比表。
6. 购买流程对接 E13 commerce（支付 SDK），成功后写 `course_purchases` 并跳回原 lesson。
7. 试听：免费节固定为每阶段第 1 节（配置驱动）。
8. 4 语种 i18n + 货币本地化。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1）
- [ ] **Access Service**（AC: 2,3,7）
  - [ ] `services/lesson-access.service.ts`
- [ ] **付费墙页**（AC: 4,5,8）
- [ ] **购买回调**（AC: 6）

## Dev Notes

### 关键约束
- 免费节规则：每阶段 lesson_no=1 free；可在 lessons 表 is_paid=false 显式覆盖。
- pass 通行证 SKU 在 E13 详细定义，本 story 只接消费接口。
- access 检查须在 API 层强制，前端拦截仅做 UX 引导。

### 关联后续 stories
- 8-3 / 8-4 接口集成
- E13 commerce
- 7-12 dashboard 显示「已购阶段」

### Project Structure Notes
- `apps/api/src/services/lesson-access.service.ts`
- `apps/api/src/routes/lessons/[id]/access.ts`
- `apps/mobile/app/paywall/[lessonId].tsx`
- `packages/db/schema/courses.ts`（course_purchases）

### References
- `planning/epics/08-courses.md` ZY-08-10

### 测试标准
- 单元：access 4 种 sku 矩阵
- 集成：未购 / 已购 / pass 路径
- 视觉：4 语种 + 多货币

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

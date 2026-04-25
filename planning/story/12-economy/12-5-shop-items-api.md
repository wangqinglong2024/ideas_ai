# Story 12.5: 商城商品表 + API

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立商城商品表与 CRUD API，支撑解锁包 / 主题 / 道具销售**，
以便 **前端商城页和后台运营有数据基础**。

## Acceptance Criteria

1. `shop_items(id, slug uniq, name jsonb 4-lang, description jsonb 4-lang, type enum [unlock|theme|prop|recharge_bundle|other], price_coins int, sku jsonb (含 ref_type/ref_id), inventory int nullable (null=无限), active bool, sort, created_at, updated_at)`。
2. 用户 API：`GET /v1/shop/items` 支持 `type / page / size`，返回仅 active 商品。
3. `GET /v1/shop/items/:slug` 详情。
4. 管理员 API：`POST/PUT/DELETE /v1/admin/shop/items` （RBAC 中间件，E17）。
5. 库存：sku.inventory 不为 null 时购买扣减；为 null 表示无限。
6. 用户已购：`GET /v1/shop/me/owned` 返回当前用户已购解锁/主题/道具。
7. 缓存：列表 60s。
8. OpenAPI 同步。

## Tasks / Subtasks

- [ ] schema + migration（AC: 1）
- [ ] 用户 API（AC: 2,3,6）
- [ ] 管理员 API + RBAC（AC: 4）
- [ ] 库存扣减事务（AC: 5）
- [ ] 缓存 + OpenAPI（AC: 7,8）
- [ ] 测试：CRUD / 库存竞态

## Dev Notes

### 关键约束
- "已购" 表 `shop_purchases(user_id, item_id, qty, created_at, ref_ledger_id)`。
- 解锁包类商品 `sku.ref_type = 'novel|course|chapter'`，购买后写对应解锁表（11-7 / 8-x）。

### Project Structure Notes
- `packages/db/schema/shop.ts`
- `apps/api/src/routes/shop.ts`
- `apps/api/src/routes/admin/shop.ts`

### References
- [Source: planning/epics/12-economy.md#ZY-12-05]

### 测试标准
- 单元 / 集成：库存并发

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

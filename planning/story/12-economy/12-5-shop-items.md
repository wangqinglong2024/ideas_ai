# ZY-12-05 · 商城商品表 + API

> Epic：E12 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `shop_items(slug, type, price_zc, payload jsonb, status)` 表
- [ ] 类型：`unlock_pack` / `theme` / `props`
- [ ] CRUD（admin）+ 前台只读
- [ ] 购买 API：`/api/v1/shop/purchase` → 调 spend → 写 entitlements / 应用主题

## 测试方法
- 集成：购买解锁包 → entitlements 出现
- ZC 不足拒绝

## DoD
- [ ] 三类型可购

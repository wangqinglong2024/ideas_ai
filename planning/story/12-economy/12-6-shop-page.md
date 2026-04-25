# Story 12.6: 商城页

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在 `/shop` 看到余额顶栏 / 商品分类 / 购买流程顺畅**，
以便 **方便地花知语币解锁内容或购买道具**。

## Acceptance Criteria

1. 路由 `/shop` 渲染：顶栏（余额 + 充值按钮）/ 分类 Tab（解锁 / 主题 / 道具 / 充值套餐）/ 商品网格。
2. 商品卡片：图标 / 名称 / 简介 / 价格（知语币 or 充值套餐显示货币）/ "购买" 按钮。
3. 购买流程：确认弹窗 → 调用 `POST /v1/shop/purchase`（内部调用 12-3 spend）→ 成功提示 + 余额刷新 + "已拥有"标记。
4. 余额不足：引导跳"充值套餐" Tab。
5. 已购商品：标记"已拥有"，对一次性商品禁用按钮。
6. 充值 Tab 复用 12-4 套餐组件。
7. 4 语 UI + a11y；移动 2 列 / 桌面 3-4 列。
8. LCP < 1.8s；INP < 200ms。

## Tasks / Subtasks

- [ ] `/shop` 路由 + 顶栏（AC: 1）
- [ ] 商品网格 + 卡片（AC: 2,5）
- [ ] 购买流程 + 余额联动（AC: 3,4）
- [ ] 充值 Tab 整合（AC: 6）
- [ ] i18n / 性能 / 测试

## Dev Notes

### 关键约束
- 余额顶栏在 `/shop` 内置；其他页面如需也复用 `<CoinsBalanceBar />`。
- 购买成功后调用 `revalidate` 刷新已购列表 + 余额。

### Project Structure Notes
- `apps/web/src/app/shop/page.tsx`
- `apps/web/src/components/shop/*`

### References
- [Source: planning/epics/12-economy.md#ZY-12-06]
- [Source: planning/prds/08-economy/]

### 测试标准
- e2e：购买成功 / 余额不足 / 已拥有

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

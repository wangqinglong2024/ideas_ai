# Story 12.7: 流水页（个人）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **查看自己知语币的获得 / 消耗时间线，可按类型筛选并看月度小结**，
以便 **明白币是怎么来的怎么花的**。

## Acceptance Criteria

1. 路由 `/me/coins` 渲染：当前余额顶栏 + 时间线列表 + 类型筛选（全部 / 获得 / 消耗 / 充值 / 退款）。
2. 时间线：每条 = 时间 / 来源 / 描述（i18n 模板）/ delta（+/-）/ balance_after。
3. 月度小结卡：本月获得 / 本月消耗 / 净增减；前 6 个月柱状图。
4. 数据来源 `GET /v1/coins/ledger?type=&from=&to=&page=&size=`，分页 / 排序。
5. 空态友好；LCP < 1.8s。
6. 4 语 UI。
7. 隐私：仅自己可见（API 端 RLS + 前端 auth guard）。
8. 导出：可下载本月 CSV（功能可选 MVP+，但本 story 实现）。

## Tasks / Subtasks

- [ ] 路由 + 时间线（AC: 1,2,5）
- [ ] 月度小结（AC: 3）
- [ ] ledger API + 筛选（AC: 4）
- [ ] CSV 导出（AC: 8）
- [ ] i18n / 测试

## Dev Notes

### 关键约束
- 描述 i18n 模板：每个 `source/action_key` 对应一组 4 语模板。
- CSV 走前端导出（数据已分页，复用 API 全量分页拉）。

### Project Structure Notes
- `apps/web/src/app/me/coins/page.tsx`
- `apps/api/src/routes/coins-ledger.ts`
- `packages/i18n/locales/*/coins.json`

### References
- [Source: planning/epics/12-economy.md#ZY-12-07]

### 测试标准
- e2e：筛选 / 翻页 / 导出

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

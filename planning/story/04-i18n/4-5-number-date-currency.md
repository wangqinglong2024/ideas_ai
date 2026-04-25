# Story 4.5: 数字 / 日期 / 货币本地化

Status: ready-for-dev

## Story

As a 前端开发者,
I want 一组基于 `Intl` 的本地化工具函数（数字 / 日期 / 货币 / 相对时间）,
so that 4 语 UI 显示符合各地习惯：USD/VND/THB/IDR 货币符号、千分符、日期顺序、相对时间。

## Acceptance Criteria

1. 在 `packages/i18n/src/intl.ts` 暴露：`formatNumber(n, opts?) / formatCurrency(n, currency) / formatDate(d, opts?) / formatRelative(d) / formatPercent(n)`。
2. 自动按当前 i18n locale 选择 `Intl` locale（en-US / vi-VN / th-TH / id-ID）。
3. 货币：默认按用户币种（用户偏好 → fallback 按 locale → 兜底 USD）；4 币种符号 / 小数位正确。
4. 日期：短 / 中 / 长三档，相对时间用 `Intl.RelativeTimeFormat`，分秒粒度自动选择。
5. SSR 安全：服务端使用同一 API，不依赖浏览器 timezone（接受 `tz` 参数）。
6. 单元测试：4 语 × 5 函数各 ≥ 2 case；测试覆盖大数（百万）、零、负数、闰年。
7. React 包装：`useFormat()` hook 返回 5 函数；`<FormatCurrency>` / `<FormatDate>` 组件用于模板。

## Tasks / Subtasks

- [ ] Task 1: 工具函数实现（AC: #1, #2, #3, #4, #5）
  - [ ] `intl.ts` 5 个函数 + `getLocale()` / `getCurrency()`
- [ ] Task 2: React 包装（AC: #7）
  - [ ] `useFormat()` hook
  - [ ] `<FormatCurrency>` / `<FormatDate>` 组件
- [ ] Task 3: 测试（AC: #6）
  - [ ] vitest table-driven 4 语 × 5 函数
  - [ ] timezone fixed 到 UTC 跑 CI

## Dev Notes

### 关键架构约束
- **不引 dayjs / moment**：性能 + bundle size 优先用原生 `Intl`。
- **货币优先级**：`user.preferences.currency > locale 默认 > USD`。
- **VND / IDR 无小数**，THB 2 位，USD 2 位 — 由 `Intl.NumberFormat` 自动判断，但要在测试中锚定。
- **相对时间**：`5 minutes ago / 5 分钟前` 等，使用 `Intl.RelativeTimeFormat`。

### 关联后续 stories
- 4-1 提供 `getLocale()` 来源
- 8-* 课程价格 / 13-* 支付页面 / 12-* 经济商店 全都依赖
- 6-7 阅读时长显示用 `formatRelative`

### 测试标准
- vitest：4 语 × 5 函数 × ≥2 case
- 边界：大数 1_000_000.5、负数、跨年、闰年 2024-02-29

### Project Structure Notes

```
packages/i18n/
  src/intl.ts
  src/react/useFormat.ts
  src/react/FormatCurrency.tsx
  src/react/FormatDate.tsx
  __tests__/intl.test.ts
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-05](../../epics/04-i18n.md)
- [Source: planning/story/04-i18n/4-1-i18next-integration.md](./4-1-i18next-integration.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

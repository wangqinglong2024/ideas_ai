# ZY-04-02 · ICU + 数字 / 日期 / 货币

> Epic：E04 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] ICU MessageFormat：复数 / 性别 / 选择
- [ ] 工具函数：`formatNumber` / `formatDate` / `formatCurrency`（基于 Intl）
- [ ] 货币支持：USD / VND / THB / IDR
- [ ] 时区按用户偏好（默认 Asia/Singapore）

## 测试方法
- vitest：典型 case（复数 0/1/many、不同语言货币符号）

## DoD
- [ ] 单元覆盖 ≥ 90%
- [ ] 全部从 `@zhiyu/i18n` export

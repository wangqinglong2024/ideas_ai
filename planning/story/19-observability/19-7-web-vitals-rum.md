# ZY-19-07 · Web Vitals RUM + 部署事件

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] FE 上报 LCP / INP / CLS / FCP / TTFB 到 `events`
- [ ] admin 仪表板按页面 / 设备聚合
- [ ] `pnpm release:mark` 命令写 `releases(version, ts, sha, notes)` + emit event
- [ ] 部署线在仪表板时间轴可见

## 测试方法
- 集成：FE 触发 vitals → 表落行
- release:mark 命令落行

## DoD
- [ ] vitals 准确；部署可视

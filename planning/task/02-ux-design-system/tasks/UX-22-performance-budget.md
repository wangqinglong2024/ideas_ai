# UX-22 · 落实性能预算

## 原文引用

- `planning/prds/01-overall/06-non-functional.md`：“FCP < 1.8s、LCP < 2.5s、TTI < 3.5s、TBT < 200ms、CLS < 0.1。”
- `planning/prds/01-overall/06-non-functional.md`：“首屏 JS 包 < 200KB gzip。”
- `planning/prds/01-overall/06-non-functional.md`：“游戏 FPS > 30 / > 60。”

## 需求落实

- 页面：应用端、后台、游戏页。
- 组件：PerformanceBudget config、bundle analyzer script、lazy loading wrappers。
- API：无。
- 数据表：events/error_events 可记录性能指标。
- 状态逻辑：路由级 code split，图片懒加载，游戏资源预加载。

## 技术假设

- Lighthouse 或本地 Playwright 性能采样在 Docker 环境执行。
- 低端 Android 作为重点预算目标。

## 不明确 / 风险

- 风险：毛玻璃/粒子影响性能。
- 处理：低端设备降级 blur 和粒子。

## 最终验收清单

- [ ] 首屏 JS gzip 有预算检查。
- [ ] LCP/FCP/CLS 有本地报告。
- [ ] 游戏帧率在基线设备或模拟场景下达标。
# UX-22 · 落实性能预算

## 原文引用

- `planning/prds/01-overall/06-non-functional.md`：“FCP < 1.8s、LCP < 2.5s、TTI < 3.5s、TBT < 200ms、CLS < 0.1。”
- `planning/prds/01-overall/06-non-functional.md`：“首屏 JS 包 < 200KB gzip。”
- `planning/prds/01-overall/06-non-functional.md`：“游戏 FPS > 30 / > 60。”

## 需求落实

- 页面：应用端、后台、游戏页。
- 组件：PerformanceBudget config、bundle analyzer script、lazy loading wrappers。
- API：无。
- 数据表：events/error_events 可记录性能指标。
- 状态逻辑：路由级 code split，图片懒加载，游戏资源预加载。

## 技术假设

- Lighthouse 或本地 Playwright 性能采样在 Docker 环境执行。
- 低端 Android 作为重点预算目标。

## 不明确 / 风险

- 风险：毛玻璃/粒子影响性能。
- 处理：低端设备降级 blur 和粒子。

## 最终验收清单

- [ ] 首屏 JS gzip 有预算检查。
- [ ] LCP/FCP/CLS 有本地报告。
- [ ] 游戏帧率在基线设备或模拟场景下达标。

# Sprint S05 · 应用骨架与导航（App Shell）

> Epic：[E05](../epics/05-app-shell.md) · 阶段：M1 · 周期：W6-W8 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-5)

## Sprint 目标
PWA 骨架、TanStack Router 路由、底部导航、顶栏、首屏发现页框架与离线兜底。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 5-3-tanstack-router | TanStack Router 配置 | M | S01,S02 | W6 |
| 2 | 5-4-tanstack-query | TanStack Query 配置 | S | S01 | W6 |
| 3 | 5-1-pwa-manifest-icons | PWA Manifest + 图标 | M | S02 | W6 |
| 4 | 5-2-service-worker | Service Worker（Workbox） | L | 5-1 | W7 |
| 5 | 5-5-bottom-navigation | 底部导航 5 项 | M | 5-3 | W7 |
| 6 | 5-6-top-bar-search | 顶栏 + 搜索入口 | M | 5-3 | W7 |
| 7 | 5-10-app-responsive-container | 响应式容器（手/平/桌） | M | S02 | W7 |
| 8 | 5-9-notification-center | 通知中心 sheet | M | 5-6 | W8 |
| 9 | 5-8-discover-skeleton | 首屏发现页骨架 | L | 5-3,5-5 | W8 |
| 10 | 5-7-global-search-modal | 全站搜索 modal（cmdk） | L | 5-6 | W8 |

## 周次计划
- **W6**：5-3 + 5-4（路由 / 数据层）；5-1 PWA manifest + 图标
- **W7**：5-2 SW；5-5 bottom nav；5-6 顶栏；5-10 响应式
- **W8**：5-8 发现页骨架；5-7 cmdk 搜索；5-9 通知中心

## 风险
- iOS PWA 推送限制（仅 16.4+） → UX 引导降级
- SW 缓存策略错误导致脏内容 → cache-version + 自动清理

## DoD
- [ ] Lighthouse PWA ≥ 95
- [ ] 离线兜底页可用
- [ ] 路由全部正常 + 滚动恢复
- [ ] 三端响应式适配
- [ ] cmdk 搜索能查到课程 / 文章 / 小说 / 词
- [ ] retrospective 完成

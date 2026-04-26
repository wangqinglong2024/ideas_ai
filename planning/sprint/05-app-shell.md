# Sprint S05 · 应用骨架与导航

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/05-app-shell.md](../epics/05-app-shell.md) · 阶段：M1 · 周期：W6-W8 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周：PWA 离线 / TanStack Router+Query persister / BottomNav+TopBar+SideNav / 命令面板 / SSR-lite 首屏 / supabase-realtime 通知中心。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W6 | D1-D3 | ZY-05-01 PWA | HTML SWR / JS-CSS cache-first / API NF 5s |
| W6 | D3-D5 | ZY-05-02 router+query | file routes + IndexedDB persister |
| W7 | D6-D8 | ZY-05-03 nav | BottomNav 4 tab+fab / TopBar / SideNav |
| W7 | D8-D10 | ZY-05-04 cmdk palette | 多类型搜索 + ⌘K |
| W8 | D11-D12 | ZY-05-05 SSR-lite | 首屏静态 HTML LCP ≤ 2.5s |
| W8 | D12-D15 | ZY-05-06 notifications | 表 + supabase-realtime broadcast |

## 依赖与并行
- 依赖 S02 / S03 / S04
- 下游：所有业务页

## 退出标准
- 飞行模式可打开缓存页
- 实时通知 ≤ 1s 到达
- LCP / INP 达标

## 风险
- realtime 端口：与 supabase-realtime 容器联通
- IndexedDB 持久化大小：监控 ≤ 50MB

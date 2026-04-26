# Epic E05 · 应用骨架与导航（App Shell）

> 阶段：M1 · 优先级：P0 · 估算：3 周
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)

## 摘要
PWA 骨架、TanStack Router 路由、底部导航、顶栏、首屏发现页框架、离线兜底。所有验证走 MCP Puppeteer 直连 `http://115.159.109.23:3100`。

## 范围
- PWA manifest + Service Worker（Workbox）
- TanStack Router（文件路由 + 类型生成）
- TanStack Query（错误兜底、重试）
- 底部 5 项导航（玩 / 学 / 发现 / 知语币 / 我）
- 顶栏（搜索 / 通知 / 知语币）
- 全站搜索 modal（cmdk）
- 首屏发现页骨架
- 离线兜底页

## Stories（按需 6）

### ZY-05-01 · PWA Manifest + Service Worker
**AC**
- [ ] manifest.json 完整（含 maskable）
- [ ] iOS splash screen 全尺寸
- [ ] Workbox：静态 cache-first；GET API stale-while-revalidate
- [ ] 离线兜底页 + 自动更新提示
- [ ] **不**集成任何 push SaaS；推送通道走 supabase-realtime 频道（占位 `notification:user:<uid>`）
**测试**：MCP Puppeteer 离线模式访问 `/`，断言渲染兜底页
**估**：L

### ZY-05-02 · TanStack Router + Query 配置
**AC**
- [ ] 文件路由 + 类型生成
- [ ] 受保护路由（`requireAuth` loader 调 supabase auth）
- [ ] 嵌套布局、滚动恢复
- [ ] QueryClient + persister（IndexedDB）
- [ ] 全局错误兜底；DevTools 仅 dev
**估**：M

### ZY-05-03 · 底部导航 + 顶栏
**AC**
- [ ] 底部 5 项玻璃态 sticky；激活态高亮；安全区
- [ ] 顶栏：logo / 搜索图标 / 通知 / 知语币入口
- [ ] 切换动画
**Tech**：ux/06
**估**：M

### ZY-05-04 · 全站搜索 modal
**AC**
- [ ] cmdk 命令面板
- [ ] 多源（课程 / 文章 / 小说 / 词）调用 `/api/v1/search?q=`，BE 走 Postgres FTS
- [ ] 历史 + 推荐
**估**：M

### ZY-05-05 · 首屏发现页骨架
**AC**
- [ ] Hero + 推荐 + 持续学习 + 内容卡片
- [ ] 横向滚动模块
- [ ] 骨架占位 + 错误兜底
**Tech**：ux/09
**估**：L

### ZY-05-06 · 通知中心 + 响应式容器
**AC**
- [ ] 通知 sheet：列表、已读 / 未读、类型过滤、单条跳转
- [ ] 数据源订阅 supabase-realtime 频道
- [ ] App 容器：< 640 / 640-1024 / > 1024 三档（容器 query）
**估**：M

## DoD
- [ ] Lighthouse PWA ≥ 95（在 zhiyu-app-fe 容器对外端口跑）
- [ ] 离线兜底可用
- [ ] 通知 realtime 在 supabase Studio 触发后 FE 能收到
- [ ] 不引用任何 push / 监控 SaaS

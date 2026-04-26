# Epic E02 · 设计系统与 UI 组件库（Design System）

> 阶段：M0 · 优先级：P0 · 估算：3 周
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)（Docker only · 单一 dev 环境）

## 摘要
落地 UX 16 文件中的设计令牌、玻璃态系统、主题、可复用组件。所有组件在容器内 Storybook 跑，外网通过端口直连查看。

## 范围
- `packages/ui`（shadcn/ui 二次封装）
- `packages/tokens`（design tokens）
- 亮 / 暗主题切换
- 4 语字体管理与子集化
- Storybook（容器内服务，端口待 ZY-02-07 决定，默认走 9101 内网）

## 非范围
- 业务页面
- 游戏内 UI（在 E09）
- 视觉回归 SaaS（Chromatic / Loki Cloud 禁用）；如需视觉回归走自托管 Loki + storybook-static 截图入 git diff（v1.5 评估）

## Stories（按需 7 个）

### ZY-02-01 · Design Tokens 包
**AC**
- [ ] 输出 CSS 变量 + TS 常量 + Tailwind v4 preset
- [ ] colors / spacing / radius / shadow / motion / typography
- [ ] 亮 / 暗双套
**Tech**：ux/02-design-tokens.md
**测试**：`docker compose run --rm zhiyu-app-fe pnpm --filter @zhiyu/tokens build`
**估**：M

### ZY-02-02 · Tailwind v4 配置 + 玻璃态系统
**AC**
- [ ] tailwind.config 引用 tokens；Cosmic Refraction 调色板（无紫）
- [ ] container queries 启用
- [ ] `.glass` `.glass-strong` `.glass-soft` utility + backdrop-filter 降级
- [ ] 性能预算（最多 3 层叠加）
**Tech**：ux/02、ux/03-glassmorphism-system.md
**估**：M

### ZY-02-03 · 主题切换（亮 / 暗 / 跟随系统）
**AC**
- [ ] ThemeProvider + useTheme hook
- [ ] localStorage 持久化、SSR 安全、无 FOUC
**Tech**：ux/04-theme-system.md
**估**：M

### ZY-02-04 · 字体子集 + 排版
**AC**
- [ ] Inter（拉丁）+ LXGW（中文）+ Noto Sans（越泰印）
- [ ] 子集化脚本 `pnpm fonts:subset`（容器内可跑）
- [ ] CSS @font-face + preload；缺字符 fallback
**Tech**：ux/14-i18n-typography.md
**估**：M

### ZY-02-05 · 核心组件
**AC**
- [ ] Button / Input / Card / Modal / Toast / Drawer / Select / Tabs / Tooltip / Avatar / Badge / Switch（12 个）
- [ ] shadcn/ui 二次封装 + 玻璃态变体
- [ ] axe-core 无 WCAG AA 违规
**Tech**：ux/07-components-core.md
**估**：L

### ZY-02-06 · 反馈 + 布局组件
**AC**
- [ ] Skeleton / Empty / Error / Loading / Result / Banner / Progress / Spinner
- [ ] Container / Grid / Stack / Splitter（容器 query 响应）
**Tech**：ux/05、ux/08
**估**：M

### ZY-02-07 · Storybook（容器化 · 内网）
**AC**
- [ ] Storybook 在 `zhiyu-app-fe` 容器中作为 dev 子服务，端口 6006 仅 zhiyu-internal 内网；如需外网查看由开发者临时 `docker port` 转发，**不**新增公网端口
- [ ] 全部组件含 stories
- [ ] 自带 a11y addon、不引入 Chromatic / Loki Cloud
**测试**：`docker compose exec zhiyu-app-fe pnpm storybook:smoke`
**估**：M

## DoD
- [ ] Storybook 全绿、a11y AA 通过
- [ ] 不引用 Chromatic / Loki Cloud / Tailwind UI 等付费 SaaS
- [ ] FE 容器内可热更新

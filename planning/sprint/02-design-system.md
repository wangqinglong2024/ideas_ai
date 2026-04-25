# Sprint S02 · 设计系统与 UI 工具库（Design System）

> Epic：[E02](../epics/02-design-system.md) · 阶段：M0 · 周期：W2-W5（与 S01 重叠 2 周） · 优先级：P0
> Story 数：10 · 估算：~M-L 10 ≈ 25 person-days
> 状态：[sprint-status.yaml](./sprint-status.yaml#epic-2)

## Sprint 目标
落地 UX 16 文件中的设计令牌、玻璃态系统、主题、可复用组件，作为 app/admin/web 三端 UI 基石。

## 成功度量
- Storybook 全组件覆盖 100%
- AA 可访问性通过 axe-core
- 视觉回归基线建立（Chromatic / Loki）
- 3 端复用率 ≥ 80%

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 2-1-design-tokens | Design Tokens 包 | M | S01 1-1 | W2 |
| 2 | 2-2-tailwind-v4-config | Tailwind v4 配置 | S | 2-1 | W2 |
| 3 | 2-5-fonts-typography | 字体子集 + 排版 | M | 2-2 | W2-W3 |
| 4 | 2-3-glassmorphism-css | 玻璃态 CSS 系统 | M | 2-2 | W3 |
| 5 | 2-4-theme-switching | 主题切换 | M | 2-1,2-2 | W3 |
| 6 | 2-8-layout-components | 布局组件 | S | 2-2 | W3 |
| 7 | 2-6-core-components | 核心组件（12） | L | 2-3,2-4,2-5 | W4 |
| 8 | 2-7-feedback-components | 反馈组件（8） | M | 2-6 | W4 |
| 9 | 2-9-microinteractions | 微交互库 | M | 2-6 | W5 |
| 10 | 2-10-storybook-visual-regression | Storybook + 视觉回归 | M | all | W5 |

## 周次计划

### W2 · 令牌与排版基础
- 2-1：colors / spacing / radius / shadow / motion / type → CSS vars + TS + Tailwind preset
- 2-2：Tailwind v4 + Cosmic Refraction palette + container queries
- 2-5（启动）：Inter + LXGW + Noto Sans 字体子集化脚本

### W3 · 玻璃态 + 主题 + 布局
- 2-3：`.glass` `.glass-strong` `.glass-soft` + 浏览器降级
- 2-4：ThemeProvider + useTheme + 跟随系统 + FOUC 防护
- 2-8：Container / Grid / Stack / Splitter
- 2-5（完结）：fonts CSS @font-face + preload + 类型覆盖测试

### W4 · 核心组件
- 2-6：Button / Input / Select / Checkbox / Radio / Switch / Card / Modal / Toast / Drawer / Tabs / Tooltip
- 2-7：Skeleton / Empty / Error / Loading / Banner / Alert / Progress / Confirm

### W5 · 微交互 + 回归测试
- 2-9：按钮按压 / hover 光晕 / 列表入场 / reduce-motion 偏好
- 2-10：Storybook stories 100% + Chromatic baseline + CI 集成 + storybook.zhiyu.io 自动部署

## 风险

| 风险 | 概率 | 影响 | 缓解 |
|---|:-:|:-:|---|
| 低端 Android backdrop-filter 性能差 | H | M | 检测 + 自动降级到固体色 |
| CJK 字体体积大 | H | M | 子集化 + 按 unicode-range 拆 |
| 主题切换闪烁 | M | M | SSR 注入 + 内联首屏 CSS |
| Chromatic 成本 | L | L | 仅 PR diff 跑；月度配额监控 |

## DoD
- [ ] Storybook 全组件覆盖 + AA 通过 axe
- [ ] 视觉回归基线 ≥ 80 stories
- [ ] 3 端引用：app + admin + web 验证可用
- [ ] storybook.zhiyu.io 自动每 PR 部署
- [ ] 字体首屏加载 ≤ 50KB（fold above content）
- [ ] retrospective 完成

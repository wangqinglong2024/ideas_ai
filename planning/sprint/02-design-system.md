# Sprint S02 · 设计系统与 UI 工具库

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/02-design-system.md](../epics/02-design-system.md) · 阶段：M0 · 周期：W2-W4 · 优先级：P0
> Story 数：7 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周内交付：设计 token + Tailwind v4 玻璃化 + 主题切换 + 自托管字体 + 核心 / 反馈 / 布局组件 + Storybook（端口 6100）。

## 排期（3 周）
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W2 | D1-D2 | ZY-02-01 design-tokens | TS+CSS+Tailwind preset，AA 对比通过 |
| W2 | D2-D3 | ZY-02-02 tailwind-glass | 4 .glass-* variant + Tailwind v4 @theme |
| W2 | D3-D5 | ZY-02-03 theme-switching | FOUC 内联脚本 + matchMedia + user_settings |
| W3 | D6-D8 | ZY-02-04 fonts-typography | 自托管 Inter/Noto SC/Arabic VF, ≤350KB gz |
| W3 | D8-D10 | ZY-02-05 core-components | Radix-based 8 组件，≥70% coverage |
| W4 | D11-D13 | ZY-02-06 feedback-layout | Toast/Banner/EmptyState/Skeleton/Stack/Grid/PageShell |
| W4 | D13-D15 | ZY-02-07 storybook-internal | port 6100 + addon-a11y |

## 依赖与并行
- 强依赖 S01 ZY-01-01..02
- 与 S03 / S04 可并行启动

## 退出标准
- 全组件 storybook 可视；4 主题 + RTL 切换无 FOUC
- 字体子集体积达标
- `grep -RE "@mui|antd|daisyUI|chakra"` 无业务命中

## 风险
- Tailwind v4 alpha 变更：锁定 minor 版本
- Inter VF 体积：subset by latin / latin-ext 双套

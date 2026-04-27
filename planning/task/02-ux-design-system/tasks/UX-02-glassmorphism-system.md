# UX-02 · 实现全局毛玻璃系统

## 原文引用

- `planning/ux/03-glassmorphism-system.md`：“用户硬性要求 #1：透明毛玻璃 风格全局应用。”
- `planning/ux/03-glassmorphism-system.md`：“毛玻璃 = 半透明背景 + 背景模糊 + 细边框 + 内高光 + 柔阴影 五要素叠加。”

## 需求落实

- 页面：应用端、后台、浮窗、Toast、TabBar、Modal 全局可用。
- 组件：`.glass`、`.glass-card`、`.glass-elevated`、`.glass-floating`、`.glass-overlay`。
- API：无。
- 数据表：无。
- 状态逻辑：低端设备或 reduced-motion 下可降级为半透明无 blur。

## 技术假设

- 毛玻璃样式集中在 `packages/ui/styles/glass.css`。
- 同屏 backdrop-filter 元素数量需要受控。

## 不明确 / 风险

- 风险：性能差设备卡顿。
- 处理：实现 `useGlassSupport` 并按硬件/偏好降级。

## 最终验收清单

- [ ] L1-L5 五类 glass class 完整。
- [ ] 亮/暗模式视觉均可读。
- [ ] 同屏毛玻璃层数检查通过。
# UX-02 · 实现全局毛玻璃系统

## 原文引用

- `planning/ux/03-glassmorphism-system.md`：“用户硬性要求 #1：透明毛玻璃 风格全局应用。”
- `planning/ux/03-glassmorphism-system.md`：“毛玻璃 = 半透明背景 + 背景模糊 + 细边框 + 内高光 + 柔阴影 五要素叠加。”

## 需求落实

- 页面：应用端、后台、浮窗、Toast、TabBar、Modal 全局可用。
- 组件：`.glass`、`.glass-card`、`.glass-elevated`、`.glass-floating`、`.glass-overlay`。
- API：无。
- 数据表：无。
- 状态逻辑：低端设备或 reduced-motion 下可降级为半透明无 blur。

## 技术假设

- 毛玻璃样式集中在 `packages/ui/styles/glass.css`。
- 同屏 backdrop-filter 元素数量需要受控。

## 不明确 / 风险

- 风险：性能差设备卡顿。
- 处理：实现 `useGlassSupport` 并按硬件/偏好降级。

## 最终验收清单

- [ ] L1-L5 五类 glass class 完整。
- [ ] 亮/暗模式视觉均可读。
- [ ] 同屏毛玻璃层数检查通过。

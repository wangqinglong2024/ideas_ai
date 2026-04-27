# UX-07 · 实现 Header / Breadcrumb / Modal Routes / FAB

## 原文引用

- `planning/ux/06-navigation-routing.md`：“默认 Header：返回箭头 / Logo、页面标题、右侧操作按钮组。”
- `planning/ux/06-navigation-routing.md`：“后台必备：所有后台页 TopBar 下显示面包屑。”
- `planning/ux/06-navigation-routing.md`：“全局浮窗：客服 IM、主题切换、通知中心。”

## 需求落实

- 页面：应用详情页、后台所有页、登录/注册 modal、客服入口。
- 组件：Header、Breadcrumb、ModalRoute、BottomSheet、FAB。
- API：无。
- 数据表：无。
- 状态逻辑：滚动 >100px header 加深；Modal 关闭回原路由；FAB 避开全屏页。

## 技术假设

- Modal route 使用 query 或 TanStack Router modal pattern。
- 客服 FAB 与 CS 模块实际会话逻辑解耦。

## 不明确 / 风险

- 风险：FAB 遮挡底部 CTA。
- 处理：统一 safe-area 与 z-index 规范。

## 最终验收清单

- [ ] Header 在滚动时状态变化正确。
- [ ] 后台面包屑可点击。
- [ ] 全屏/沉浸页不显示不该出现的 FAB。
# UX-07 · 实现 Header / Breadcrumb / Modal Routes / FAB

## 原文引用

- `planning/ux/06-navigation-routing.md`：“默认 Header：返回箭头 / Logo、页面标题、右侧操作按钮组。”
- `planning/ux/06-navigation-routing.md`：“后台必备：所有后台页 TopBar 下显示面包屑。”
- `planning/ux/06-navigation-routing.md`：“全局浮窗：客服 IM、主题切换、通知中心。”

## 需求落实

- 页面：应用详情页、后台所有页、登录/注册 modal、客服入口。
- 组件：Header、Breadcrumb、ModalRoute、BottomSheet、FAB。
- API：无。
- 数据表：无。
- 状态逻辑：滚动 >100px header 加深；Modal 关闭回原路由；FAB 避开全屏页。

## 技术假设

- Modal route 使用 query 或 TanStack Router modal pattern。
- 客服 FAB 与 CS 模块实际会话逻辑解耦。

## 不明确 / 风险

- 风险：FAB 遮挡底部 CTA。
- 处理：统一 safe-area 与 z-index 规范。

## 最终验收清单

- [ ] Header 在滚动时状态变化正确。
- [ ] 后台面包屑可点击。
- [ ] 全屏/沉浸页不显示不该出现的 FAB。

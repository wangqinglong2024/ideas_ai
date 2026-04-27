# AD-18 · 实现后台 UX 壳与导航

## PRD 原文引用

- `planning/prds/12-admin/01-functional-requirements.md`：“简洁数据驱动 UI（参考 Linear / Stripe Dashboard）；暗色 / 亮色主题；桌面优先，移动响应。”
- `planning/ux/11-screens-admin.md` 定义登录、Dashboard、内容管理、用户、订单、客服等后台屏幕。

## 需求落实

- 页面：后台全部路由。
- 组件：AdminAppShell、Sidebar、TopBar、Breadcrumbs、ThemeToggle。
- API：无直接 API。
- 数据表：无。
- 状态逻辑：路由切换保留筛选状态；移动端 Sidebar 抽屉。

## 不明确 / 风险

- 风险：后台移动端不是主场景但仍需基本可用。
- 处理：桌面优先，移动端保证导航和表格横向滚动。

## 技术假设

- 与应用端共享 design tokens，但后台布局更高密度。

## 最终验收清单

- [ ] Sidebar/TopBar/Breadcrumbs 可用。
- [ ] 亮暗主题切换生效。
- [ ] 后台主要页面桌面优先布局。
- [ ] 移动端抽屉可导航。
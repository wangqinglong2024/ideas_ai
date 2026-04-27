# UX-06 · 实现应用端四 Tab 导航

## 原文引用

- `planning/ux/06-navigation-routing.md`：“发现 `/discover`、课程 `/courses`、游戏 `/games`、我的 `/profile`。”
- `planning/ux/06-navigation-routing.md`：“未登录可见：所有 4 个 Tab 始终显示。”

## 需求落实

- 页面：`/discover`、`/courses`、`/games`、`/profile`。
- 组件：TabBar、TabItem、Badge。
- API：无。
- 数据表：无。
- 状态逻辑：点击切路由并保留滚动位置；双击回顶部；长按显示提示/快捷。

## 技术假设

- 使用 lucide-react 图标 Compass、BookOpen、Gamepad2、User。
- 未登录限制由业务页面和 UA 模块处理。

## 不明确 / 风险

- 风险：课程路由 PRD 使用 `/learn`，UX 使用 `/courses`。
- 处理：路由层可保留 alias，但导航按 UX `/courses`。

## 最终验收清单

- [ ] 四个 Tab 未登录可见。
- [ ] 激活态 rose + dot。
- [ ] 游戏画布和沉浸页隐藏 TabBar。
# UX-06 · 实现应用端四 Tab 导航

## 原文引用

- `planning/ux/06-navigation-routing.md`：“发现 `/discover`、课程 `/courses`、游戏 `/games`、我的 `/profile`。”
- `planning/ux/06-navigation-routing.md`：“未登录可见：所有 4 个 Tab 始终显示。”

## 需求落实

- 页面：`/discover`、`/courses`、`/games`、`/profile`。
- 组件：TabBar、TabItem、Badge。
- API：无。
- 数据表：无。
- 状态逻辑：点击切路由并保留滚动位置；双击回顶部；长按显示提示/快捷。

## 技术假设

- 使用 lucide-react 图标 Compass、BookOpen、Gamepad2、User。
- 未登录限制由业务页面和 UA 模块处理。

## 不明确 / 风险

- 风险：课程路由 PRD 使用 `/learn`，UX 使用 `/courses`。
- 处理：路由层可保留 alias，但导航按 UX `/courses`。

## 最终验收清单

- [ ] 四个 Tab 未登录可见。
- [ ] 激活态 rose + dot。
- [ ] 游戏画布和沉浸页隐藏 TabBar。

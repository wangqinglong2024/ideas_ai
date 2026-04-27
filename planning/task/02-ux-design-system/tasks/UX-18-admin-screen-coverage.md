# UX-18 · 覆盖后台关键屏幕

## 原文引用

- `planning/ux/11-screens-admin.md` 目录定义后台登录、Dashboard、文章、课程、小说、游戏词包、内容工厂、审校、用户、订单、订阅、知语币、分销、客服等屏幕。
- `planning/prds/12-admin/01-functional-requirements.md`：“简洁数据驱动 UI（参考 Linear / Stripe Dashboard）。”

## 需求落实

- 页面：`/admin` 及全部后台一级/二级页面。
- 组件：AdminShell、Sidebar、TopBar、DataCard、Table、EditorShell、ReviewWorkbench。
- API：`/admin/api/*` 由 AD 模块接入。
- 数据表：admin_users、audit、各模块内容表。
- 状态逻辑：按角色显示导航；无权限隐藏入口并由 API 拦截。

## 技术假设

- 内容工厂 v1 只展示占位和导入入口。
- 真实 AI 一键生成按钮在 dev 不执行真实模型。

## 不明确 / 风险

- 风险：后台范围很大。
- 处理：本任务要求屏幕壳全覆盖，业务深功能按模块任务实现。

## 最终验收清单

- [ ] 后台一级导航与 UX 目录一致。
- [ ] 每个后台屏幕有 loading/empty/error。
- [ ] 角色无权限时页面不可访问。
# UX-18 · 覆盖后台关键屏幕

## 原文引用

- `planning/ux/11-screens-admin.md` 目录定义后台登录、Dashboard、文章、课程、小说、游戏词包、内容工厂、审校、用户、订单、订阅、知语币、分销、客服等屏幕。
- `planning/prds/12-admin/01-functional-requirements.md`：“简洁数据驱动 UI（参考 Linear / Stripe Dashboard）。”

## 需求落实

- 页面：`/admin` 及全部后台一级/二级页面。
- 组件：AdminShell、Sidebar、TopBar、DataCard、Table、EditorShell、ReviewWorkbench。
- API：`/admin/api/*` 由 AD 模块接入。
- 数据表：admin_users、audit、各模块内容表。
- 状态逻辑：按角色显示导航；无权限隐藏入口并由 API 拦截。

## 技术假设

- 内容工厂 v1 只展示占位和导入入口。
- 真实 AI 一键生成按钮在 dev 不执行真实模型。

## 不明确 / 风险

- 风险：后台范围很大。
- 处理：本任务要求屏幕壳全覆盖，业务深功能按模块任务实现。

## 最终验收清单

- [ ] 后台一级导航与 UX 目录一致。
- [ ] 每个后台屏幕有 loading/empty/error。
- [ ] 角色无权限时页面不可访问。

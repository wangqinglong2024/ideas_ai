# FP-05 · 建立 Admin Web 前端入口

## 原文引用

- `planning/spec/01-overview.md`：“Admin Web | 管理后台 | React + Vite。”
- `planning/rules.md` 端口表：“admin-fe | 4100 | 管理后台前端。”

## 需求落实

- 页面：后台登录页、后台 Shell、占位 Dashboard。
- 组件：AdminShell、Sidebar、TopBar、ProtectedRoute、ThemeProvider。
- API：通过 SDK 调用 admin-be `/admin/api/*`。
- 数据表：无直接写库。
- 状态逻辑：未登录跳登录，登录态由 AD 模块后续接入。

## 技术假设

- 路径建议 `system/apps/admin-fe`。
- 管理后台桌面优先，移动端仅响应式可用。

## 不明确 / 风险

- 风险：后台权限未接入前可能出现假登录。
- 处理：只保留 dev 占位，不开放真实写操作。

## 最终验收清单

- [ ] Docker 启动后 `http://localhost:4100` 可访问。
- [ ] 后台 Shell 能加载主题与基础导航。
- [ ] 所有后台 API base 指向 admin-be 9100。

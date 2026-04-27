# AD-08 · 建立 4 内容模块后台入口

## PRD 原文引用

- `AD-FR-006`：“内容管理（4 模块）：DC、CR、GM、NV。”
- `planning/ux/06-navigation-routing.md` 后台 Sidebar：“文章 (DC) / 课程 (CR) / 小说 (NV) / 游戏 (GM)。”

## 需求落实

- 页面：`/admin/content/articles`、`/admin/content/courses`、`/admin/content/games`、`/admin/content/novels`。
- 组件：AdminContentSidebar、ContentModuleShell。
- API：各内容模块使用 `/admin/api/content/*`。
- 数据表：各内容模块表、admin_audit_logs。
- 状态逻辑：入口与 RBAC 先统一，具体 CRUD 由 14-17 子模块负责。

## 不明确 / 风险

- 风险：只做入口会遗漏内容闭环。
- 处理：必须依赖 14-17 四个目录，每个目录有独立任务清单。

## 技术假设

- Sidebar 支持最多 3 级菜单。

## 最终验收清单

- [ ] 四个内容入口均可路由。
- [ ] editor/admin 可见，viewer 只读。
- [ ] 当前模块面包屑正确。
- [ ] 入口链接到 14-17 对应实现任务。
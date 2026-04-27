# AD-02 · 实现后台 RBAC

## PRD 原文引用

- `planning/prds/12-admin/01-functional-requirements.md` 角色表：“admin / editor / reviewer / cs / viewer”。

## 需求落实

- 页面：后台全部页面。
- 组件：RoleGuard、PermissionDeniedState。
- API：`/admin/api/*` role middleware。
- 数据表：`admin_users`。
- 状态逻辑：admin 全部权限；editor 内容 CRUD；reviewer 仅审校；cs 客服和用户基本信息；viewer 只读 dashboards。

## 不明确 / 风险

- 风险：内容模块细粒度权限未定义。
- 处理：v1 按角色粗粒度，14-17 模块可追加 resource action。

## 技术假设

- role claim 由后台登录服务签入 JWT 或服务端 session。

## 最终验收清单

- [ ] editor 无法管理 admin role。
- [ ] reviewer 不能改源内容。
- [ ] cs 看不到订单敏感详情。
- [ ] viewer 所有写操作返回 403。
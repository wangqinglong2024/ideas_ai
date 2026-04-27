# FP-06 · 建立 Admin API 后端入口

## 原文引用

- `planning/spec/01-overview.md`：“Admin API | 后台 API | Express + RBAC。”
- `planning/rules.md` 端口表：“admin-be | 9100 | 管理后台 API。”

## 需求落实

- 页面：无。
- 组件：Express app、admin auth middleware、RBAC middleware、audit middleware。
- API：`/admin/api/*`、`/health`、`/ready`、`/metrics`。
- 数据表：`admin_users`、`admin_audit_logs` 由 AD 模块迁移。
- 状态逻辑：所有写操作必须进入审计链路，权限不足返回标准错误。

## 技术假设

- 路径建议 `system/apps/admin-be`。
- 后台 API 不复用 app-be 运行进程。

## 不明确 / 风险

- 风险：早期未接 TOTP 时登录能力不完整。
- 处理：AD 任务实现强制 2FA，本任务只建入口与中间件插槽。

## 最终验收清单

- [ ] Docker 启动后 9100 可访问 `/health`。
- [ ] `/admin/api/*` 统一走 RBAC 中间件。
- [ ] 写操作中间件具备审计插槽。

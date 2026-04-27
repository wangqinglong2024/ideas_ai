# AD-19 · 统一 `/admin/api` 契约与中间件

## PRD 原文引用

- `planning/prds/12-admin/02-data-model-api.md`：“API（管理后台专属，路径前缀 /admin/api）。”
- 同文件：“鉴权：JWT + role claim；中间件按 role 拦截；写操作必经 audit_logs。”
- 同文件：“列表 P95 < 500ms；详情 P95 < 800ms；操作 P95 < 1s。”

## 需求落实

- 页面：无。
- 组件：无。
- API：所有 `/admin/api/*`。
- 数据表：`admin_users`、`admin_audit_logs`。
- 状态逻辑：统一响应 `{ data, meta, error }`；分页、错误码、request_id、审计、RBAC 中间件全局接入。

## 不明确 / 风险

- 风险：app API 和 admin API 共用后端还是分服务。
- 处理：按基础平台规划有 `admin-be` 独立入口，但复用 shared packages。

## 技术假设

- admin-be 暴露主机 9100，前端 admin-fe 4100。

## 最终验收清单

- [ ] `/admin/api` 前缀统一。
- [ ] 未登录返回 401，无权限返回 403。
- [ ] 写操作自动审计。
- [ ] 性能指标满足 P95 要求。
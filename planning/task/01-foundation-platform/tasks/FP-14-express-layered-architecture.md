# FP-14 · 建立 Express 分层架构模板

## 原文引用

- `planning/spec/04-backend.md`：“每业务模块遵循同一结构。”
- `planning/spec/04-backend.md`：“Route → Controller → Service → Repository → DB。”

## 需求落实

- 页面：无。
- 组件：route、controller、service、repository、db client、error mapper。
- API：所有 app/admin API 按模块注册。
- 数据表：repository 层访问 Drizzle/Supabase。
- 状态逻辑：controller 不写业务；service 不直接处理 HTTP；repository 不包含 UI 状态。

## 技术假设

- app-be 和 admin-be 共享后端基础包，但路由入口和权限中间件分离。
- 使用 Zod 做 request/response schema。

## 不明确 / 风险

- 风险：早期为了赶进度把 SQL 写进 controller。
- 处理：lint 或 review checklist 检查层级边界。

## 最终验收清单

- [ ] 后端模板包含 route/controller/service/repository。
- [ ] 示例 health 之外的业务模块按模板实现。
- [ ] 错误响应统一走 error mapper。

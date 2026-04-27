# W0 Dev Docker Release Gate

来源：`planning/task/01-foundation-platform/tasks/FP-34-w0-release-gate-dev-only.md`、`planning/rules.md`、`planning/prds/01-overall/09-release-plan.md`。

- [ ] `docker compose -f docker/docker-compose.yml up -d --build` 成功。
- [ ] App/Admin 前端固定端口 `3100`、`4100` 可访问。
- [ ] App/Admin API 固定端口 `8100`、`9100` 的 `/health`、`/ready` 通过。
- [ ] `pnpm preflight` 不发现禁用运行文件、禁用外部服务或端口偏离。
- [ ] 账号注册、OTP、登录、偏好、会话、导出、销户链路通过。
- [ ] Admin 登录、RBAC、写操作审计、内容入口、客服、导出、Feature Flags、安全合规页通过。
- [ ] MCP Browser 对 App 与 Admin 全页面完成 smoke 与截图。
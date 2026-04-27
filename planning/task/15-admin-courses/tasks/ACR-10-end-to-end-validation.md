# ACR-10 · 端到端验证与审计

## PRD 原文引用

- `planning/rules.md` §11.4：`pnpm seed` + MCP Puppeteer 端到端。
- `AD-FR-012`：操作审计 100% 覆盖写操作。

## 需求落实

- E2E 脚本：`system/scripts/e2e/admin-courses.e2e.ts`（MCP Puppeteer 驱动）。
- 流程：
  1. 登录 admin（4100 端口）。
  2. 进入课程树 → 创建临时 lesson + 12 知识点 + 1 节小测。
  3. publish → 切到应用端（3100）登录普通用户 → 进入对应 lesson 学完 + 通过小测。
  4. 校验：进度 / 错题 / 学习时长 / 知语币奖励正确。
  5. 后台撤回 lesson → 应用端再次访问 → 提示已下线。
  6. 全程检查 audit_logs。
- 报告：输出 JSON 到 `system/log/e2e-admin-courses-<ts>.json`。

## 验证要点

- [ ] 所有写操作（create/update/publish/archive/grant）写 admin_audit_logs。
- [ ] before/after diff 准确。
- [ ] reviewer 角色不能编辑源（403）。
- [ ] editor 不能改 user role（403）。

## 技术假设

- 测试账号：seed 中预置 admin@dev / editor@dev / reviewer@dev / user1@dev。
- E2E 用真实 docker compose 起的 dev 环境。

## 最终验收清单

- [ ] E2E 脚本一次跑完无失败。
- [ ] audit_logs 行数与写操作数一致。
- [ ] 角色权限拒绝场景全部 403。
- [ ] JSON 报告可在 dashboard 中查看。
- [ ] 失败时输出截图与请求日志便于定位。

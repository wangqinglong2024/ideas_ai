# FP-31 · 建立 Docker 内测试命令

## 原文引用

- `planning/rules.md`：“单元：vitest。”
- `planning/rules.md`：“集成：vitest + supertest。”
- `planning/rules.md`：“E2E：MCP Puppeteer 直连 3100/4100。”

## 需求落实

- 页面：无。
- 组件：test scripts、vitest config、supertest setup、e2e smoke scripts。
- API：测试覆盖 health、auth smoke、module smoke。
- 数据表：测试 schema 或 dev DB，必须可重置。
- 状态逻辑：所有测试从 Docker 容器内执行，不依赖宿主直接 dev server。

## 技术假设

- `pnpm test`、`pnpm test:integration`、`pnpm test:e2e` 在 `system/` 下定义。
- E2E 工具调用由后续执行环境决定，任务只定义命令和端口。

## 不明确 / 风险

- 风险：MCP Puppeteer 在某些环境不可用。
- 处理：保留手动 curl/smoke fallback，但不删除 E2E 要求。

## 最终验收清单

- [ ] 单元测试可在容器内运行。
- [ ] 集成测试可连 app-be/admin-be。
- [ ] E2E smoke 指向 3100/4100。

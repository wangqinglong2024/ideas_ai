# ZY-18-07 · 漏洞扫描 + 依赖管理

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `pnpm audit` 容器内一次性脚本：`docker compose run --rm zhiyu-app-be pnpm audit --audit-level high`
- [ ] `socket-cli` 集成（npm install audit）
- [ ] Renovate 配置文件提交（`renovate.json`）但**不接外部 CI**；用户后续可启用
- [ ] 高危漏洞文档化处理流程 markdown

## 测试方法
- 手动跑 audit 脚本

## DoD
- [ ] 脚本可在 dev 容器内运行

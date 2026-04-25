# Story 18.8: 漏洞扫描 + 依赖管理（CodeQL / Renovate / OWASP ZAP）

Status: ready-for-dev

## Story

作为 **安全 / DevOps**，
我希望 **CI 集成代码静态分析、依赖更新与定期 DAST**，
以便 **持续发现高危漏洞，并在 24h 内响应处置**。

## Acceptance Criteria

1. **CodeQL** GitHub Action：每次 PR + nightly 默认分支，覆盖 JS/TS；高危直接 block PR。
2. **Renovate / Dependabot**：每周 pin / minor / patch 更新 PR；security advisory 立即 PR；自动合并条件（CI 通过 + minor）可配置。
3. **lockfile 完整性**：`pnpm audit` 在 CI；severity ≥ high 阻塞合并；exception 列表存 `.github/security-exceptions.yml`，每条带过期日期与负责人。
4. **secret 扫描**：trufflehog / gitleaks 在 PR + nightly；命中阻塞 + 通知。
5. **OWASP ZAP**（v1.5 接入）：staging 环境 nightly DAST；本 story 提供占位 workflow + 文档。
6. **响应 SLA**：高危 24h、中危 7d、低危 30d；通过 Issue label 跟踪。
7. **SBOM**：每次 release 生成 SPDX SBOM 附 GitHub Release；CycloneDX 备份。
8. **license 合规**：禁止 GPL / AGPL 依赖（CI check）；exception 列表同上。
9. **私有依赖审计**：`packages/*` 内部依赖关系自动生成图；循环依赖告警。
10. **告警通道**：飞书 / 邮件 / Sentry release health。
11. e2e：注入已知 CVE 包 → CI 阻塞；secret 扫描 catch 测试。

## Tasks / Subtasks

- [ ] **CodeQL 工作流**（AC: 1）
- [ ] **Renovate / Dependabot**（AC: 2）
  - [ ] `renovate.json` 策略
- [ ] **pnpm audit + secret scan**（AC: 3, 4）
- [ ] **OWASP ZAP placeholder**（AC: 5）
- [ ] **SBOM**（AC: 7）
  - [ ] cyclonedx-npm + spdx
- [ ] **License check**（AC: 8）
- [ ] **依赖图**（AC: 9）
- [ ] **告警通道**（AC: 10）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- exception 列表 PR 必须双 reviewer（安全 + 工程）；过期未处理自动 reopen。
- secret scan 命中 → 立即吊销 key + 旋转，绝不仅是"删 commit"。
- Renovate 自动合并白名单：dev dependencies + types + minor 内部包；prod 主依赖必须人工 review。
- SBOM 包含所有 transitive deps + license + version；存 R2 长期保存。
- GPL/AGPL 例外：仅允许构建工具（不分发到客户端 / 服务端运行时）。

### 关联后续 stories
- E01 CI 已就绪
- 18-10 incident response（依赖于扫描发现）

### Project Structure Notes
- `.github/workflows/codeql.yml`
- `.github/workflows/secrets-scan.yml`
- `.github/workflows/zap-baseline.yml`（占位）
- `.github/workflows/sbom.yml`
- `.github/workflows/audit.yml`
- `renovate.json`
- `.github/security-exceptions.yml`

### References
- `planning/epics/18-security.md` ZY-18-08

### 测试标准
- CI：注入 CVE / secret → 阻塞
- SBOM：release 时附件
- exception：过期自动 reopen

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

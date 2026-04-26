# ZY-18-07 · 漏洞扫描 + 依赖审计

> Epic：E18 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 工程负责人
**I want** 每周自动扫依赖漏洞（npm audit / osv-scanner）+ 镜像扫描（trivy）
**So that** 不带漏洞上线。

## 上下文
- 工具：本地 osv-scanner + trivy（apt 安装）；不接 GitHub Dependabot / Snyk SaaS
- BullMQ weekly cron 跑 + 写报告到 storage + 通知

## Acceptance Criteria
- [ ] script `scripts/security-scan.sh`
- [ ] cron 每周日 03:00
- [ ] 报告生成 + 通知 admin
- [ ] 高危 → 自动开 ticket（ZY-15-05）

## 测试方法
```bash
cd /opt/projects/zhiyu/system
bash scripts/security-scan.sh
```

## DoD
- [ ] 报告产出
- [ ] 高危触发 ticket

## 依赖
- 上游：ZY-19

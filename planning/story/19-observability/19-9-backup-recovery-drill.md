# Story 19.9: 备份与恢复演练

Status: ready-for-dev

## Story

作为 **SRE / DPO**，
我希望 **关键数据每日自动备份，R2 启用版本控制，并以季度为周期演练恢复流程**，
以便 **任何数据丢失场景可在 RTO 4h / RPO 24h 内恢复，并满足合规审计（20-9）**。

## Acceptance Criteria

1. **数据库**（Supabase / Postgres）：
   - 每日 02:00 UTC 全量逻辑备份（`pg_dump --format=custom`）→ R2 `backups/db/yyyy/mm/dd/`
   - 加密：AES-256 at-rest + 客户端 GPG 公钥再封一层
   - 保留：daily 30d / weekly 90d / monthly 365d
2. **R2 / 对象存储**：开启 versioning + lifecycle（90d 转 IA）；用户上传 bucket 启用 MFA delete。
3. **Redis**（如有持久化）：每周 RDB 快照 → R2，保留 30d。
4. **配置 / Secrets**：每日导出 Render env / Stripe / DNS / Cloudflare 配置 → 加密 git 仓库 `infra-backup/`。
5. **恢复演练**：季度（Q1/Q2/Q3/Q4）一次：
   - 在 staging 环境从 backup 恢复 DB
   - 验证 100 条业务关键查询
   - 计时（目标：RTO < 4h）
   - PIR 文档化
6. **Runbook** `docs/runbooks/backup-restore.md`：步骤 / 命令 / 责任人 / 检查点。
7. **告警**：备份任务失败 / 24h 未成功 / 大小骤降 50% → Slack（19-6）。
8. **合规**：保留策略与隐私政策一致（20-9）；GDPR 删除请求需级联清理备份（标记，下次轮转生效）。

## Tasks / Subtasks

- [ ] **DB 备份**（AC: 1）
  - [ ] `apps/cron/jobs/db-backup.ts`
  - [ ] GPG 公钥加密
  - [ ] 保留策略 lifecycle（R2 rule）
- [ ] **R2 / Redis**（AC: 2, 3）
  - [ ] R2 versioning + MFA delete
  - [ ] Redis snapshot job
- [ ] **配置备份**（AC: 4）
  - [ ] `apps/cron/jobs/config-backup.ts`
  - [ ] `infra-backup` 私仓 + age/sops
- [ ] **演练**（AC: 5, 6）
  - [ ] runbook
  - [ ] 一次成功演练 + PIR
- [ ] **告警**（AC: 7）
  - [ ] BetterStack rule
- [ ] **合规**（AC: 8）
  - [ ] GDPR 删除标记表 `gdpr_erasure_log`
  - [ ] 下次轮转校验脚本

## Dev Notes

### 关键约束
- **绝对不要**把 GPG 私钥放服务器；存放线下硬件密钥（创始人 + CTO 双 m-of-n）。
- 备份大小骤降是数据丢失先兆 → 强制告警阈值 50%。
- 演练必须在**独立** staging，绝不污染生产。
- GDPR 删除请求 30 天内必须完成最后一次备份级联（≥ 365d 备份内全部清除）。

### 关联后续 stories
- 19-1 日志归档共用 R2 bucket（不同前缀）
- 19-6 告警
- 20-9 法律合规

### Project Structure Notes
- `apps/cron/jobs/{db-backup,config-backup,redis-snapshot}.ts`
- `infra-backup/`（私仓）
- `docs/runbooks/backup-restore.md`

### References
- [planning/epics/19-observability.md ZY-19-09](../../epics/19-observability.md)
- [planning/spec/09-security.md](../../spec/09-security.md)

### 测试标准
- 单元：备份脚本 mock R2 上传
- 集成：staging 恢复 100 query 通过
- 演练：RTO < 4h，文档化

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

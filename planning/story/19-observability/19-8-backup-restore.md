# ZY-19-08 · 备份与恢复演练

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] zhiyu-worker 容器内 daily cron：`pg_dump` supabase → `/opt/backups/supabase/<ts>/`
- [ ] supabase-storage 全量同步 → `/opt/backups/storage/<ts>/`
- [ ] 保留 30 天滚动（worker cron 清理）
- [ ] runbook md：恢复步骤（参考 `/opt/backups/supabase/20260426-105954/RESTORE.md`）
- [ ] 季度演练记录模板

## 测试方法
- cron 触发后宿主目录有备份
- 在 dev 环境演练 restore（导入到临时 schema）

## DoD
- [ ] 备份 + 恢复手册齐

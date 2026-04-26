# ZY-19-08 · 备份 / 恢复

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** SRE
**I want** Postgres + Storage 自动备份 + 每月恢复演练
**So that** 灾难时数据可快速重建。

## 上下文
- pg_dump + gz → `/opt/backups/supabase/<ts>/`
- 7 日滚动 + 每月归档保留 6 月
- Storage rsync 到同目录 storage/
- 恢复脚本 `scripts/restore.sh <ts>`
- BullMQ daily cron 02:00

## Acceptance Criteria
- [ ] backup.sh + cron
- [ ] restore.sh 可指定时间点
- [ ] 月度演练记录模板
- [ ] 备份完成 → 写 alerts info

## 测试方法
```bash
bash /opt/projects/zhiyu/system/scripts/backup.sh
ls -la /opt/backups/supabase/
```

## DoD
- [ ] 一次完整备份+恢复演练通过

## 依赖
- 上游：ZY-01-05

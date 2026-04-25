# Story 1.10: Supabase 初始化

Status: ready-for-dev

## Story

As a 开发者,
I want 在 Singapore region 创建 3 套 Supabase 项目（dev/staging/prod）并启用 PITR + 备份,
so that 后续 Epic 的所有数据建模与迁移有可靠的数据基础设施。

## Acceptance Criteria

1. Supabase 创建 3 个项目：`zhiyu-dev`、`zhiyu-staging`、`zhiyu-prod`，全部 Singapore region。
2. plan：dev=Free，staging=Pro（Small），prod=Pro（Medium）—— 容量与 PITR 满足 spec/05 要求。
3. PITR（Point-in-Time Recovery）启用 staging + prod，保留 7 天。
4. 自动备份每日 cron（Supabase 内置），prod 额外配置 weekly logical dump 到 R2（脚本 + cron）。
5. 网络连接测试：从本地 / Render staging / Render prod 三处分别 ping 成功，延迟 < 50ms（Render SG → Supabase SG）。
6. 数据库扩展：启用 `pg_trgm`、`uuid-ossp`、`pgcrypto`、`pg_stat_statements`，三环境一致。
7. 提供 `tools/db/check-connection.ts`：CI 中跑通连接测试。
8. 文档 `docs/supabase.md`：项目 ID、URL、控制台访问、备份恢复步骤、降级 region 步骤。
9. RLS 默认策略：所有未来表必须显式启用 RLS，提供 lint 脚本 `tools/db/check-rls.ts` 在迁移后扫描无 RLS 的表并报警。
10. 不在本 story 创建业务表（业务表由各对应 Epic 完成）；仅创建一个 `_meta.health_check (id int)` 健康表。

## Tasks / Subtasks

- [ ] Task 1: 项目创建（AC: #1, #2）
  - [ ] dashboard 创建 3 项目，记录 URL / anon key / service key 至 Doppler
- [ ] Task 2: PITR + 备份（AC: #3, #4）
  - [ ] dashboard 启用 PITR
  - [ ] `tools/db/dump-to-r2.ts`，cron via Render scheduler
- [ ] Task 3: 扩展（AC: #6）
  - [ ] migration `0000_init_extensions.sql`
- [ ] Task 4: 健康检查 + RLS lint（AC: #5, #7, #9, #10）
  - [ ] `tools/db/check-connection.ts`
  - [ ] `tools/db/check-rls.ts`
  - [ ] 健康表 + seed
- [ ] Task 5: 文档（AC: #8）

## Dev Notes

### 关键
- Supabase Auth 在本 story 不接（用户系统由 E03 独立实现，可能不用 Supabase Auth 而用自建；待 1-1 团队确认 → 方案 B：自建 JWT，仅用 Supabase 的 Postgres + Storage）
- migration 工具：用 `drizzle-kit` 或 `supabase migration new`，本 story 选 **drizzle-kit**（与代码生成结合好），具体在 E03 落地

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-10](../../epics/01-platform-foundation.md)
- [Source: planning/spec/05-data-model.md](../../spec/05-data-model.md)
- [Source: planning/sprint/01-platform-foundation.md#W2](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List

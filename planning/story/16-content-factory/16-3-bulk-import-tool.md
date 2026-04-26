# ZY-16-03 · 批量导入工具

> Epic：E16 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 运营
**I want** CLI / admin 工具一次导入 12 类文件夹下的种子内容（china / course / novels / games）
**So that** 重置环境时数据一致快。

## 上下文
- CLI：`pnpm tsx scripts/import-seed.ts --kind=china`
- admin 页：选 kind + 上传 zip 或选服务器路径 → 入队
- 幂等：用 slug 唯一索引；存在则 update
- 失败明细写 gen_jobs.error

## Acceptance Criteria
- [ ] CLI 4 kind（china / course / novels / wordpacks）
- [ ] admin 触发同 logic
- [ ] 测试用 5 条种子样例

## 测试方法
```bash
cd /opt/projects/zhiyu/system
pnpm tsx scripts/import-seed.ts --kind=china
docker compose exec supabase-db psql ... -c "select count(*) from zhiyu.articles"
```

## DoD
- [ ] CLI 4 kind 通

## 依赖
- 上游：ZY-16-01 / 02 / ZY-06 / ZY-08 / ZY-11

# ZY-18-06 · 数据导出 / 删除（GDPR）

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 一键申请导出 / 删除全部账号数据
**So that** 满足 GDPR / 个人信息保护法。

## 上下文
- 复用 ZY-03-06 实现；本 story 强化"全量字段 / 30 日延迟删除 / 关联数据级联"
- 导出 zip 含：profiles / settings / wallet / ledger / orders / referrals / commissions / posts / comments / favorites / reading_progress / progress / srs_cards / mistake_log / cs / tickets

## Acceptance Criteria
- [ ] 导出 zip 完整
- [ ] 删除 30 日 pending → final delete cascade
- [ ] 取消窗口（pending 状态）
- [ ] 审计

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run gdpr.export gdpr.delete
```

## DoD
- [ ] zip 完整 + delete 不留孤儿

## 依赖
- 上游：ZY-03-06

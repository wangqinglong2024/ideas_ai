# ZY-18-04 · 数据加密 + 审计日志

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 敏感字段（手机 / 身份证 / 银行卡）AES-GCM 加密；密钥来自 env（dev 占位）
- [ ] supabase-storage 启用 server-side encryption（默认）
- [ ] schema `zhiyu.audit_logs(actor_id, action, target_type, target_id, before jsonb, after jsonb, ip, ts)`
- [ ] 后台所有写操作自动写入（middleware）
- [ ] append-only（无 UPDATE/DELETE 权限）；保留 7 年

## 测试方法
- 单元：加解密往返
- 集成：admin 改用户 → audit_logs 出现

## DoD
- [ ] 100% 后台写操作覆盖

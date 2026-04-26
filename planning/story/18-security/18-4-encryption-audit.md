# ZY-18-04 · 加密 + 审计

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 安全负责人
**I want** 敏感字段（OTP / TOTP secret / device fingerprint）静态加密 + 关键操作审计日志
**So that** 即便 DB 泄露关键秘密仍受保护。

## 上下文
- 加密：libsodium (sealed box) 或 node:crypto AES-256-GCM；密钥从 env `APP_ENCRYPTION_KEY`（缺失则启动失败 only in prod；dev 自动生成临时）
- 审计：admin 所有 mutate 操作 → audit_log（接 ZY-17-01）+ 业务关键操作（退款 / 封禁 / 大额充值）

## Acceptance Criteria
- [ ] EncryptionService（encrypt/decrypt）+ migration 加密 totp_secret 等
- [ ] AuditLogger middleware
- [ ] 单测 + 缺 key 报错路径
- [ ] 不可篡改 (audit_log 不允许 update/delete)

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run security.crypto
```

## DoD
- [ ] 加密往返正确
- [ ] 审计入库

## 依赖
- 上游：ZY-17-01

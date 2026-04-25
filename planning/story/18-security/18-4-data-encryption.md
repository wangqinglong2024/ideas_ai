# Story 18.4: 数据加密（TLS / 字段级 AES-GCM / R2 SSE）

Status: ready-for-dev

## Story

作为 **安全工程师**，
我希望 **强制 TLS 1.3、对敏感字段 AES-GCM 加密、对象存储 SSE**，
以便 **传输与静态数据均达到加密合规底线**。

## Acceptance Criteria

1. **TLS 1.3 强制**：Cloudflare 配置 minimum TLS 1.3；不允许降级；HSTS（18-3 联动）。
2. **API**：所有出入流量 TLS；HTTP → HTTPS 301。
3. **字段级加密**：
   - 用户手机号（users.phone）
   - 用户实名信息（如未来加入）
   - admin TOTP secret（admin_users.totp_secret_enc，与 17-1 协同）
   - 邮箱仅 hash 索引（保留明文以便发邮件，但不允许日志输出）
4. **算法**：AES-256-GCM，key 来自 doppler `ENC_KEY_DEK`（数据加密密钥）；KEK（主密钥）env `ENC_KEY_KEK` 包裹 DEK，DEK 落库（`encryption_keys`）支持轮换。
5. **辅助库** `packages/security/src/crypto.ts`：`encryptField(plaintext, aad?) → { ciphertext, iv, tag, key_version }`、`decryptField(...)`；AAD 通常为 `table:column:id`。
6. **轮换**：DEK 每 90d 轮换；旧版本 DEK 保留以解密历史；CLI `pnpm crypto:rotate-dek`。
7. **R2 SSE**：所有 bucket 启用 SSE-S3（KMS by Cloudflare）；上传时 `x-amz-server-side-encryption: AES256`。
8. **数据库连接**：Postgres 连接强制 SSL（`sslmode=require`）；Redis TLS（如 Upstash）。
9. **日志过滤**：敏感字段名（password / token / secret / phone / email / pii）过滤；Sentry beforeSend 钩子。
10. **测试**：encrypt → decrypt 往返；旧 key 解密；R2 上传 header 验证。

## Tasks / Subtasks

- [ ] **TLS / HSTS**（AC: 1, 2）
- [ ] **crypto 模块**（AC: 3-6）
  - [ ] AES-GCM 实现
  - [ ] KEK/DEK 包裹
  - [ ] encryption_keys 表 + 轮换 CLI
- [ ] **R2 SSE**（AC: 7）
- [ ] **DB / Redis SSL**（AC: 8）
- [ ] **日志过滤**（AC: 9）
- [ ] **测试**（AC: 10）

## Dev Notes

### 关键约束
- AAD 不可省略：相同密文搬到不同记录解密失败，避免横向越权。
- IV 12 字节随机，绝不复用；每次 encrypt 生成。
- key_version 字段必须落库：未来轮换时知道用哪个 DEK 解密。
- 邮箱加密会破坏 ILIKE 搜索；本 story 邮箱不加密（运营搜索需），仅 hash 索引列辅助。
- KMS 升级路径（v1.5）：DEK 由 cloud KMS 包裹，本 story 用本地 KEK 简化。

### 关联后续 stories
- 18-1（密码 / token 协同）
- 17-1（admin totp_secret_enc）
- 18-9 WAF / 18-3 HSTS

### Project Structure Notes
- `packages/security/src/crypto.ts`
- `packages/security/cli/rotate-dek.ts`
- `packages/db/schema/security.ts` (encryption_keys)
- `packages/storage/r2.ts`（SSE header）

### References
- `planning/epics/18-security.md` ZY-18-04
- `planning/spec/09-security.md` § 4

### 测试标准
- 单元：encrypt/decrypt + AAD 错配拒绝
- 集成：DEK 轮换后旧密文仍可解
- 安全：R2 PUT 强制 header

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

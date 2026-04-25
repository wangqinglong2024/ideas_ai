# Story 14.2: 注册时邀请码生成

Status: ready-for-dev

## Story

作为 **新注册用户**，
我希望 **系统在注册成功后自动为我生成一个不可改、不直接暴露的邀请码**，
以便 **我能通过分享链接（14-3）邀请朋友，但永远不会以纯 code 字符串形式被暴露或被滥用**。

## Acceptance Criteria

1. 注册流程（E03 ZY-03-* 结束钩子）成功后调用 `referralService.ensureCode(userId)`：
   - 已存在 → 直接返回 code_id（用于内部）。
   - 不存在 → 生成 6 位 code，写 `referral_codes`。
2. 字符集：`ABCDEFGHJKMNPQRSTUVWXYZ23456789`（排除 `0/O/1/I/L`，避免人眼歧义）。
3. 唯一性冲突重试：DB unique 错误 → 重新生成最多 5 次；超 5 次告警。
4. 写入 `referral_codes` 后**不可变**：无任何 API 修改 / 删除 / 重生 code。
5. 任何 API 不直接返回 `code` 字段：
   - `GET /api/me/profile` 不含 code。
   - `GET /api/me/referral/share-link` 返回完整 URL（14-3 处理）。
   - `GET /api/me/referral/dashboard` 不含 code。
6. 内部使用 `code_id` (referral_codes.id) 作为引用，避免日志泄漏。
7. 注册失败 / 回滚 → 邀请码不应留下孤儿（事务保护）。
8. 旧用户回填：上线后跑一次性脚本为存量用户补建 referral_codes（幂等）。
9. 监控：注册→成码 P95 < 50ms；冲突率 < 0.1%。
10. 单元 + 集成测试：5000 次并发注册无重复 code；脚本回填无重复。

## Tasks / Subtasks

- [ ] **生成器**（AC: 2,3）
  - [ ] `packages/referral/code-generator.ts`
  - [ ] 32 字符集 base32-style
  - [ ] retry 最多 5 次

- [ ] **服务接口**（AC: 1,4,7）
  - [ ] `packages/referral/services/ensure-code.ts`
  - [ ] 在 E03 注册成功钩子中调用（事务内）

- [ ] **API 防呆**（AC: 5,6）
  - [ ] 审查所有 me/profile / dashboard 响应 schema
  - [ ] 加 schema 单元测试断言无 `code` 键

- [ ] **存量回填脚本**（AC: 8）
  - [ ] `scripts/referral/backfill-codes.ts`
  - [ ] 幂等

- [ ] **观测**（AC: 9）
  - [ ] Prometheus histogram + counter

## Dev Notes

### 关键约束
- 字符集 31 个字符 → 6 位空间 ≈ 8.87 亿，足够 v1 规模。
- 必须事务内创建：注册 + code 同事务，注册回滚则 code 也回滚。
- Logger 不打印 code 明文：使用 redact 中间件，code 字段强制脱敏（code_id 替代）。

### 关联后续 stories
- 14-3 share-link 使用 code 构建 URL（仅一次性，URL 中的 code 是工程必要）
- 14-9 dashboard 读 share-link，不读 code
- E03 注册流程钩子

### Project Structure Notes
- `packages/referral/code-generator.ts`
- `packages/referral/services/ensure-code.ts`
- `scripts/referral/backfill-codes.ts`
- `apps/api/src/middleware/redact-code.ts`

### References
- `planning/epics/14-referral.md` ZY-14-02
- `planning/sprint/14-referral.md`

### 测试标准
- 单元：字符集校验、retry 上限
- 并发：5000 注册无重复
- 集成：注册回滚事务下 code 不留

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

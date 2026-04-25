# Story 3.2: 注册 API + 邮箱验证

Status: ready-for-dev

## Story

As a 新用户,
I want 用邮箱 + 密码注册账号，并在 24h 内完成邮箱验证激活,
so that 我能开始学习并保护账号安全。

## Acceptance Criteria

1. `POST /v1/auth/register` 接受 `{ email, password, nickname?, country_code?, language?, referral_code? }`。
2. 输入校验（zod）：
   - email RFC5322 + DNS MX（异步软校验）
   - password ≥ 10 字符 + 至少 1 字母 + 1 数字；通过 zxcvbn ≥ 2
   - nickname 可选，1-30 字符，过滤敏感词
3. 密码 bcrypt cost **12** 哈希；明文密码绝不入日志 / Sentry。
4. **Cloudflare Turnstile** captcha 校验通过才落库（前端传 `turnstile_token`）。
5. 重复邮箱 → 返回 409；为防枚举，也可统一返回 200 + "若邮箱可注册，已发送邮件"（按 spec/09 §2 选择策略）。
6. 注册成功：插入 `users` 行（`email_verified_at = null`）、生成 `verification_token`（128 位 random，bcrypt 存 `email_verification_tokens` 表）、调 Resend 发验证邮件（4 语模板）。
7. 验证 token 有效期 **24 小时**；过期接口返回明确错误并提示重发。
8. `POST /v1/auth/verify-email { token }` 验证 token → 设 `email_verified_at = now()` → 删 token。
9. `POST /v1/auth/resend-verification` 限流：同邮箱 5 分钟 1 次；24h 最多 5 次（Redis）。
10. 整体限流：同 IP 注册 10 分钟 ≤ 3 次；超出 429。
11. 单元 + 集成测试覆盖：成功 / 弱密码 / 重复 / Turnstile 失败 / 重发限流 / token 过期。
12. OWASP 检查：无 SQL 注入、HTML escape、邮件头注入防护。

## Tasks / Subtasks

- [ ] Task 1: API 路由 + 校验（AC: #1, #2）
  - [ ] `apps/api/src/routes/auth/register.ts`
  - [ ] zod schema + zxcvbn
- [ ] Task 2: bcrypt + Turnstile（AC: #3, #4）
  - [ ] `lib/password.ts` `lib/turnstile.ts`
- [ ] Task 3: 邮件 + 验证 token（AC: #6, #7, #8）
  - [ ] migration `0007_email_verification_tokens.sql`
  - [ ] Resend client + 4 语 react-email 模板
- [ ] Task 4: 限流（AC: #9, #10）
  - [ ] Redis Sliding window helper
- [ ] Task 5: 测试（AC: #11, #12）

## Dev Notes

### 关键约束
- **bcrypt cost=12**：API CPU 预算 ~250ms / req，可接受
- 邮件模板 4 语：en / zh / vi / th / hi（依 E04，先用 en 占位 + key）
- Turnstile site key dev/prod 区分，存 Doppler
- token 表存 hash 而非明文

### 依赖链
- 依赖：3-1（users 表）、S01 1-7 Doppler、S01 1-11 Redis
- 被依赖：3-3 / 3-5 / 3-10

### Project Structure Notes
```
apps/api/src/
  routes/auth/{register,verify-email,resend-verification}.ts
  lib/{password,turnstile,email}.ts
  email/templates/verification.{en,zh,vi,th,hi}.tsx
  migrations/0007_email_verification_tokens.sql
```

### Security
- OWASP A02 / A03 / A07
- 邮件 header injection：用 Resend SDK，无字符串拼接

### References
- [Source: planning/epics/03-user-account.md#ZY-03-02](../../epics/03-user-account.md)
- [Source: planning/spec/04-backend.md](../../spec/04-backend.md)
- [Source: planning/spec/09-security.md](../../spec/09-security.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List

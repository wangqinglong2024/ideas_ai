# Story 18.6: 隐私政策 + TOS（4+1 语 · 必勾选）

Status: ready-for-dev

## Story

作为 **法务 / 产品**，
我希望 **拥有经过律师审稿的隐私政策与服务条款（4+1 语），并在注册时强制勾选**，
以便 **满足 GDPR / PDPA / VN PDPL / TH PDPA 等法规并降低跨国合规风险**。

## Acceptance Criteria

1. **5 语版本**：zh / en / vi / th / id 各一份；保存为 `legal_documents`（id / type enum 'privacy'|'tos'|'cookie'|'dpa' / locale / version int / content_md / effective_at / created_by）。
2. **唯一约束**：(type, locale) 同一时刻只允许一个 active（partial unique index）。
3. **路由** `/legal/{type}/{locale}` 静态渲染（SSR / SSG），sitemap 收录，SEO 友好。
4. **注册流程接入**（与 E03-2 协同）：
   - 注册必填勾选 zh + 当前 locale 两个 checkbox（保留同意证据）；
   - 写 `user_legal_consents`（user_id / type / version / locale / accepted_at / ip / ua）。
5. **重大变更重确认**：版本号变化时下次登录强制重新同意；旧版本不删除可追溯。
6. **后台 CMS**：`/admin/legal`（17-x 拓展）：版本管理 / 多语对比 / 发布 / 律师签发记录。
7. **DPA**（数据处理协议）模板：与 Paddle / Cloudflare / Supabase / Sentry / Anthropic / DeepSeek 等签订并存档；本 story 创建管理界面 + 文件上传 R2。
8. **Cookie banner**：欧盟 / 越南 / 泰国地区显示 banner（基于 IP geolocation），同意写 `user_legal_consents` type=cookie。
9. **数据保留与删除政策**：与 18-7 GDPR 协同，policy 文本明确「30 天软删 + 7 年审计保留 + 匿名化分析」。
10. **注册阻断**：未勾选无法继续注册（前端 + 后端双校验）。
11. e2e 测试 + 律师 sign-off 记录。

## Tasks / Subtasks

- [ ] **Schema + migration**（AC: 1, 2, 4, 7）
- [ ] **静态页路由**（AC: 3）
- [ ] **注册接入**（AC: 4, 10）
- [ ] **重确认流程**（AC: 5）
- [ ] **Admin CMS**（AC: 6, 7）
- [ ] **Cookie banner**（AC: 8）
- [ ] **DPA 文档管理**（AC: 7）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- 律师审稿是阻塞依赖；本 story 包含模板版本，最终上线版本须 sign-off。
- effective_at 不可早于发布日；早于今天的日期拒绝。
- Cookie banner 不需要 EU 用户「opt-in 全部」，仅严格必要 cookie 默认开；analytics 默认关，需显式开启。
- 同意证据保留：`user_legal_consents` 7 年（与 18-5 审计一致）。
- 4+1 语优先级：zh 主，外语 en/vi/th/id；冲突时以 zh 为准（条款明示）。

### 关联后续 stories
- E03 注册流程
- 18-7 GDPR
- 18-5 audit
- 17-x admin

### Project Structure Notes
- `apps/web/src/pages/legal/`
- `apps/admin/src/pages/legal/`
- `packages/db/schema/legal.ts`
- `packages/db/seeds/legal-templates.ts`
- `apps/api/src/routes/admin/legal.ts`

### References
- `planning/epics/18-security.md` ZY-18-06
- `planning/spec/09-security.md`

### 测试标准
- e2e：注册必勾选；版本变更重确认
- 数据：consent 记录完整
- 合规：律师 sign-off 记录归档

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

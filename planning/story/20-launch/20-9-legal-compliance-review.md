# Story 20.9: 法律合规检查

Status: ready-for-dev

## Story

作为 **法务 / DPO / 创始人**，
我希望 **隐私 / 用户协议 / 退款 / Cookie 4+1 语完整就绪，DPA 与外部服务商全部签订，4 国合规清单逐项确认**，
以便 **上线零法律风险，可应对 GDPR / 越南 PDPL / 泰国 PDPA / 印尼 PDP Law / 新加坡 PDPA 监管**。

## Acceptance Criteria

1. **法律页面**（4+1 语，VN/TH/ID/EN/中）：
   - `/legal/privacy`（隐私政策）
   - `/legal/tos`（用户协议）
   - `/legal/refund`（退款政策）
   - `/legal/cookie`（Cookie 政策）
   - `/legal/dmca`（侵权投诉）
   - `/legal/community`（社区准则）
2. **数据处理协议（DPA）** 全部签订并归档：
   - Supabase / Render / Cloudflare / R2 / Stripe / Sentry / PostHog / Better Stack / Anthropic / DeepSeek / Resend
3. **Cookie 同意**：4+1 语 banner；分类（必要 / 分析 / 营销 / 个性化）；选择前不加载非必要脚本；选择记录 365d；可二次更改。
4. **数据主体权利（DSR）**：
   - 访问 / 更正 / 删除 / 导出 自助入口（账户设置）
   - 客服 fallback：30 天内响应（GDPR）
   - 删除请求级联到备份（19-9 标记 + 365d 内清除）
5. **Age Gate**：注册页要求 ≥ 13 岁；< 16 岁需家长同意（GDPR-K）；UI 4+1 语。
6. **未成年保护**：< 18 岁不得购买；客服可申请退款；社区匿名头像。
7. **4 国合规清单**：每国一份 checklist（数据本地化要求 / 备案 / 内容审查 / 支付牌照）。
8. **法务审阅**：所有页面外部律师审签字（PDF 入仓 `legal/signed/`）。
9. **可观测**：DSR 请求 / Cookie 选择 → PostHog 事件 + Better Stack 日志（隔离敏感字段）。

## Tasks / Subtasks

- [ ] **法律页面**（AC: 1, 8）
  - [ ] mdx 内容 4+1 语
  - [ ] schema.org `WebPage`
  - [ ] 律师审签
- [ ] **DPA 归档**（AC: 2）
  - [ ] `legal/dpa/<vendor>.pdf` 私仓
  - [ ] 表格 `legal/dpa-status.md`
- [ ] **Cookie 同意**（AC: 3）
  - [ ] CookieConsent 组件 + 分类
  - [ ] localStorage 持久化
  - [ ] 设置页二次更改
- [ ] **DSR 自助**（AC: 4）
  - [ ] `/account/privacy` 页面
  - [ ] API: 导出 (json zip) / 删除 (软删 + 备份标记)
  - [ ] 客服工单类别 `dsr`
- [ ] **Age Gate**（AC: 5, 6）
  - [ ] 注册页生日 + 家长同意流程
  - [ ] 支付前 18+ 检查
- [ ] **4 国清单**（AC: 7）
  - [ ] `legal/checklist/{vn,th,id,sg}.md`
- [ ] **可观测**（AC: 9）

## Dev Notes

### 关键约束
- **删除请求**必须不可逆，但需保留法律义务最小集（财务 7 年、违规留存）；UI 提示。
- Cookie 默认全关（opt-in），不可暗改 default true。
- 生日存 year-month 即可，不需精确到日（最小化原则）。
- 所有未成年退款流程不需举证，先退后核（合规优先）。
- 4 国「数据本地化」目前未强制（VN/ID 例外要密切跟踪）；用 R2 + Supabase Singapore region 满足东南亚就近。

### 关联后续 stories
- 19-9 备份：DSR 删除级联
- 20-1 营销站 legal 页面入口
- 20-3 Play Console 隐私政策链接
- 14（i18n）：5 语翻译资源
- E15 客服：DSR 工单类别

### Project Structure Notes
- `apps/marketing/app/legal/**`
- `apps/web/app/account/privacy/`
- `apps/api/src/routes/account/privacy.ts`
- `legal/{dpa,checklist,signed}/`

### References
- [planning/epics/20-launch.md ZY-20-09](../../epics/20-launch.md)
- [planning/spec/09-security.md](../../spec/09-security.md)

### 测试标准
- 单元：DSR 导出 / 删除 API
- 集成：Cookie banner 选择前 0 第三方请求
- 法律：律师审签字版本入仓

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

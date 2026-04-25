# Story 13.5: 套餐选择 UI

Status: ready-for-dev

## Story

作为 **未付费用户**，
我希望 **在 `/pricing` 页面清晰对比月 / 年 / 终身订阅与充值包**，
以便 **以本地货币、本地化文案 + 推荐徽章高效完成购买决策**。

## Acceptance Criteria

1. `/pricing` 页面（公开 + 登录后均可访问）展示：
   - 订阅区：月 / 年 / 终身 三卡片；年卡显示「省 33%」徽章；终身显示「最划算」徽章。
   - 充值区：4 档充值包（500 / 1500 / 5000 / 15000 ZC），分别显示 0% / 10% / 20% / 30% bonus 徽章。
2. 价格本地化：调用 `GET /api/payments/plans?currency=auto`，后端按 IP / `Accept-Language` / 用户 `preferred_lang` + `country_code` 返回当地货币（USD / EUR / VND / THB / IDR / CNY 等）；前端使用 `Intl.NumberFormat`。
3. 文案 4 语 i18n：套餐 name / description / 卖点 bullets 通过 `plans.name_i18n_jsonb` + `i18n` namespace 渲染。
4. 已登录用户：显示当前订阅状态横幅「您已是月度会员，剩余 12 天」；可选「升级到年度」直达 13-6 升级流程。
5. CTA 点击 → 调 `usePaddleCheckout` hook（13-2）；带 `coupon_code` query 参数则预填 13-8。
6. 全球付款方式条块：在底部展示 Visa / Mastercard / AmEx / PayPal / Apple Pay / Google Pay / 当地银行 / 钱包 logo（按 country_code 动态过滤）。
7. 响应式：桌面三列卡片，平板两列，移动单列堆叠 + 横滑充值包。
8. SEO：`/pricing` 服务端渲染（SSR）+ 4 语 hreflang + JSON-LD `Product` & `Offer` schema。
9. A11y：所有卡片 keyboard 可达；推荐徽章使用 `aria-label`；价格的视觉强调有文本替代。
10. Lighthouse Performance ≥ 90、Accessibility ≥ 95。

## Tasks / Subtasks

- [ ] **后端 plans API**（AC: 2）
  - [ ] `apps/api/src/routes/payments/plans.ts`
  - [ ] currency 自动检测（geoip-lite + Accept-Language）
  - [ ] FX rates 缓存（exchangerate.host，1h TTL）

- [ ] **页面骨架 + SSR**（AC: 1,7,8）
  - [ ] `apps/app/src/routes/pricing.tsx`
  - [ ] 子组件 `PlanCard`, `CoinsPackCard`, `PaymentMethodsRow`, `CurrentSubscriptionBanner`
  - [ ] JSON-LD 注入

- [ ] **i18n + 价格格式**（AC: 2,3）
  - [ ] `apps/app/src/lib/format-currency.ts`
  - [ ] i18n keys: `pricing.monthly.name` etc.

- [ ] **CTA + 升级直达**（AC: 4,5）
  - [ ] 已登录拉 `GET /api/me/subscription`
  - [ ] 升级按钮 → 跳 13-6 流程或直接 checkout

- [ ] **支付方式徽标**（AC: 6）
  - [ ] `apps/app/public/payment-icons/`
  - [ ] 国家 → 方法映射表

- [ ] **A11y + Lighthouse**（AC: 9,10）
  - [ ] axe-core CI
  - [ ] Lighthouse CI 门槛

## Dev Notes

### 关键约束
- 价格展示必须包含 「税费由 Paddle / LemonSqueezy 处理（MoR）」 小字注脚。
- 终身套餐限购：UI 检测用户已购终身则禁用按钮 + 提示。
- 充值包按 ZC 单位展示，附「= $X 美元」次要文案。

### 关联后续 stories
- 13-2 / 13-4 触发 checkout
- 13-6 升级直达
- 13-8 coupon 预填

### Project Structure Notes
- `apps/app/src/routes/pricing.tsx`
- `apps/app/src/features/pricing/`
- `apps/api/src/routes/payments/plans.ts`
- `packages/i18n/locales/{zh,en,vi,th,id}/pricing.json`

### References
- `planning/epics/13-payment.md` ZY-13-05
- `planning/spec/03-frontend.md`（design system）

### 测试标准
- 单元：format-currency 边界
- 集成：plans API IP 切换货币
- 视觉：4 语 + 3 断点截图回归
- A11y：axe 0 violations

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

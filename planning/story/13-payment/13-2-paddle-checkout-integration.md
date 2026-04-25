# Story 13.2: Paddle 集成 + Checkout

Status: ready-for-dev

## Story

作为 **付费用户**，
我希望 **在套餐页点击「立即订阅」后弹出 Paddle Checkout 完成支付**，
以便 **用本地货币、当地常用支付方式（卡 / 钱包 / 银行）一键购买知语的订阅或充值包**。

## Acceptance Criteria

1. Paddle Sandbox + Production Vendor 账号配置完成；Products / Prices 与 `plans.paddle_product_id` 一一映射（脚本同步）。
2. 后端 `POST /api/payments/paddle/checkout` 接受 `{plan_id, coupon_code?}` → 创建 `payment_orders`(status=pending) → 返回 `{transactionId, customer_email, passthrough}`；passthrough 含 `{order_id, user_id, plan_code}` 用于 webhook 回填。
3. 前端 Paddle.js v2 加载（`https://cdn.paddle.com/paddle/v2/paddle.js`）；通过 `Paddle.Initialize({ token: PADDLE_CLIENT_TOKEN, environment })` 初始化；环境根据 `import.meta.env.MODE` 自动切换。
4. 客户邮箱、preferred_lang、country_code 预填到 `Paddle.Checkout.open()` 的 customer 字段；用户已登录则只读，未登录跳登录。
5. 支持订阅（`plans.type='subscription'`）与一次性（`one_time` / `coins_pack`）；订阅传 priceId 数组，一次性同样。
6. Checkout 成功 / 失败 / 关闭三态由 `eventCallback` 上报：成功 → 跳 `/payment/success?order=:id`（轮询订单状态最多 30s）；失败 → toast；关闭不修改订单。
7. 安全：Vendor token 通过环境变量注入；server 端 PADDLE_API_KEY 不出现在前端；CSP 允许 `cdn.paddle.com` `*.paddle.com`。
8. 失败兜底：检测 Paddle 不可用（脚本加载失败 / 国家受限 → 错误码 4000+）→ 自动调用 13-4 LemonSqueezy 替代入口（事件 `payment.fallback`）。
9. 单元 + E2E：sandbox 测试卡 `4242 ...` 完成支付；订单 status 在 30s 内由 webhook 改为 paid。

## Tasks / Subtasks

- [ ] **后端 checkout 接口**（AC: 2）
  - [ ] `apps/api/src/routes/payments/paddle.ts`
  - [ ] 校验 plan 存在 + 用户已登录
  - [ ] 创建 pending order；幂等键 = (user_id + plan_id + 5min 内 pending)
  - [ ] 应用 13-8 优惠券（如传入 coupon_code）

- [ ] **Paddle products 同步脚本**（AC: 1）
  - [ ] `scripts/payment/sync-paddle-products.ts`
  - [ ] 读 plans 表 → 创建 / 更新 Paddle Products & Prices
  - [ ] 写回 `plans.paddle_product_id`

- [ ] **前端 Paddle.js 集成**（AC: 3-7）
  - [ ] `apps/app/src/lib/payment/paddle.ts`：lazy load + Initialize
  - [ ] `apps/app/src/features/payment/usePaddleCheckout.ts` hook
  - [ ] eventCallback 上报到 `/api/analytics/track`

- [ ] **成功跳转 + 轮询**（AC: 6）
  - [ ] `apps/app/src/routes/payment/success.tsx`
  - [ ] 1s 轮询 `GET /api/me/orders/:id` 直到 paid 或 30s 超时

- [ ] **Fallback to LemonSqueezy**（AC: 8）
  - [ ] 检测加载失败 / `error.code >= 4000` → emit `payment.fallback` 事件
  - [ ] 路由切到 13-4 入口

- [ ] **E2E 测试**（AC: 9）
  - [ ] Playwright + Paddle sandbox 自动卡

## Dev Notes

### 关键约束
- Paddle.js v2 是「Paddle Billing」新版，不是旧 Paddle Classic；prices 必须从 Billing 后台创建。
- `passthrough` 字段最大 1000 字符，仅传必要 ID，不要塞用户敏感信息。
- 客户端 token 是「client-side token」，与 server API key 分离。
- 国家受限（中国大陆 / 古巴 / 朝鲜等）由 Paddle 直接拦截，前端需显式 catch。

### 关联后续 stories
- 13-3 webhook 消费 passthrough 改 order
- 13-4 LemonSqueezy fallback
- 13-5 套餐选择 UI 触发
- 13-8 coupon 注入 checkout

### Project Structure Notes
- `apps/api/src/routes/payments/paddle.ts`
- `apps/app/src/lib/payment/paddle.ts`
- `apps/app/src/features/payment/usePaddleCheckout.ts`
- `apps/app/src/routes/payment/success.tsx`
- `scripts/payment/sync-paddle-products.ts`
- `.env`：`PADDLE_CLIENT_TOKEN`, `PADDLE_API_KEY`, `PADDLE_ENV`

### References
- `planning/epics/13-payment.md` ZY-13-02
- `planning/spec/07-integrations.md` § 3.1
- Paddle Billing Docs: https://developer.paddle.com/build/checkout/build-overlay-checkout

### 测试标准
- 单元：checkout 接口幂等
- 集成：plans 同步脚本 dry-run
- E2E：sandbox 完整支付链；fallback 触发 LemonSqueezy

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List

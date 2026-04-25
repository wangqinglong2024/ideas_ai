# 9.2 · 分销 · 数据模型与 API

## 数据模型

```sql
CREATE TABLE referral_codes (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  changed_count INT DEFAULT 0
);

CREATE TABLE referral_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id),  -- 被推荐人
  l1_user_id UUID REFERENCES users(id),                -- 直推
  l2_user_id UUID REFERENCES users(id),                -- 间推
  source_code TEXT,
  source_ip TEXT,
  source_device_id TEXT,
  is_effective BOOLEAN DEFAULT FALSE,
  effective_at TIMESTAMPTZ,
  is_suspicious BOOLEAN DEFAULT FALSE,
  suspicious_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_relations_l1 ON referral_relations(l1_user_id, is_effective);
CREATE INDEX idx_relations_l2 ON referral_relations(l2_user_id, is_effective);

CREATE TABLE referral_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_user_id UUID NOT NULL REFERENCES users(id),  -- 收佣人
  source_user_id UUID NOT NULL REFERENCES users(id),       -- 被推荐人
  level INT NOT NULL CHECK (level IN (1,2)),
  order_id UUID NOT NULL,
  order_amount_usd DECIMAL(10,2) NOT NULL,
  rate DECIMAL(4,3) NOT NULL,           -- 0.20
  amount_usd DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',         -- pending/confirmed/reversed/paid
  confirmed_at TIMESTAMPTZ,
  reversed_at TIMESTAMPTZ,
  reverse_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comm_user ON referral_commissions(beneficiary_user_id, status, created_at DESC);

CREATE TABLE referral_withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount_usd DECIMAL(10,2) NOT NULL,
  channel TEXT NOT NULL,                 -- 'paypal','wise','bank','coins'
  channel_account JSONB,                 -- {paypal_email, bank_info, ...}
  status TEXT DEFAULT 'pending',         -- pending/processing/paid/failed
  failure_reason TEXT,
  external_ref TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE TABLE referral_balances (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  pending_usd DECIMAL(12,2) DEFAULT 0,
  confirmed_usd DECIMAL(12,2) DEFAULT 0,
  paid_usd DECIMAL(12,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE referral_relations ENABLE ROW LEVEL SECURITY;
CREATE POLICY rlsp_self ON referral_relations FOR SELECT USING (
  user_id = auth.uid() OR l1_user_id = auth.uid() OR l2_user_id = auth.uid()
);
ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY rlsp_self ON referral_commissions FOR SELECT USING (beneficiary_user_id = auth.uid());
ALTER TABLE referral_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY rlsp_self ON referral_balances USING (user_id = auth.uid());
```

## API

- `GET /api/me/referral` — 仪表板
- `GET /api/me/referral/code` — 自己的邀请码
- `POST /api/me/referral/code/regenerate` — 改 1 次
- `POST /api/me/referral/withdraw` — Body `{amount_usd, channel, channel_account}`
- `GET /api/me/referral/withdrawals?status=`
- `GET /api/me/referral/commissions?status=&page=`

### 内部 / 系统调用
- `referralService.bindParent(userId, code, ip, deviceId)` — 注册触发
- `referralService.checkEffective(userId)` — daily cron 触发
- `referralService.recordCommission(orderId)` — 订单成功 webhook 触发
- `referralService.reverseCommission(orderId, reason)` — 退款触发

## 邀请关系绑定逻辑

```
用户 X 注册（ref=ABC123）
  ↓
查 referral_codes WHERE code='ABC123' → user A
  ↓
检查反作弊：
  - device_id(X) == device_id(A) → 拒
  - 同 IP 24h 内同上级 ≥ 4 → 标 suspicious
  ↓
查 A 的上级 B（A 的 referral_relations.l1_user_id）
  ↓
INSERT referral_relations (X, l1=A, l2=B, ...)
```

## 佣金计算逻辑

```
订单 O 成功（user X，$40）
  ↓
查 referral_relations WHERE user_id=X
  ├── L1=A → INSERT commission(beneficiary=A, level=1, amount=$8)
  └── L2=B → INSERT commission(beneficiary=B, level=2, amount=$8)
  ↓
14 天后 cron：status pending → confirmed + 更新 balance
```

## 提现流程
- 用户提交 → balance.confirmed -= amount, balance.paid += amount
- PayPal / Wise / 银行人工或 API 处理
- 失败 → 回滚

## 性能
- 仪表板 P95 < 500ms
- 提现提交 P95 < 1s

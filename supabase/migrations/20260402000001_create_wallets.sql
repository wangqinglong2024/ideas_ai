-- 用户钱包（余额不可为负）
CREATE TABLE public.wallets (
    id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    balance          decimal(10,2) NOT NULL DEFAULT 0.00,
    total_earned     decimal(10,2) NOT NULL DEFAULT 0.00,
    total_withdrawn  decimal(10,2) NOT NULL DEFAULT 0.00,
    updated_at       timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT wallets_balance_non_negative CHECK (balance >= 0)
);

CREATE INDEX idx_wallets_user_id ON public.wallets(user_id);

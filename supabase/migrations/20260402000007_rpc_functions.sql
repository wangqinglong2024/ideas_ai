-- ===== 原子事务 RPC 函数 =====

-- 1. 佣金结算（支付成功后调用）
CREATE OR REPLACE FUNCTION public.settle_commission(
    p_order_id       uuid,
    p_buyer_id       uuid,
    p_referrer_id    uuid,
    p_commission_amount decimal
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER   -- 以 owner 权限执行（绕过 RLS）
AS $$
BEGIN
    -- 买家自购返佣
    INSERT INTO public.commissions (beneficiary_id, order_id, type, amount)
    VALUES (p_buyer_id, p_order_id, 'self_cashback', p_commission_amount)
    ON CONFLICT (order_id, type) DO NOTHING;

    -- 更新买家钱包
    UPDATE public.wallets
    SET balance      = balance + p_commission_amount,
        total_earned = total_earned + p_commission_amount,
        updated_at   = now()
    WHERE user_id = p_buyer_id;

    -- 若有邀请人，给邀请人推荐佣金
    IF p_referrer_id IS NOT NULL THEN
        INSERT INTO public.commissions (beneficiary_id, order_id, type, amount)
        VALUES (p_referrer_id, p_order_id, 'referral', p_commission_amount)
        ON CONFLICT (order_id, type) DO NOTHING;

        UPDATE public.wallets
        SET balance      = balance + p_commission_amount,
            total_earned = total_earned + p_commission_amount,
            updated_at   = now()
        WHERE user_id = p_referrer_id;
    END IF;
END;
$$;

-- 2. 提现时扣除余额（余额不足时触发 CHECK 约束报错）
CREATE OR REPLACE FUNCTION public.deduct_wallet_balance(
    p_user_id uuid,
    p_amount  decimal
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.wallets
    SET balance    = balance - p_amount,
        updated_at = now()
    WHERE user_id = p_user_id;
    -- CHECK (balance >= 0) 会自动拦截余额不足
END;
$$;

-- 3. 拒绝提现：退还余额
CREATE OR REPLACE FUNCTION public.refund_wallet_balance(
    p_user_id uuid,
    p_amount  decimal
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.wallets
    SET balance    = balance + p_amount,
        updated_at = now()
    WHERE user_id = p_user_id;
END;
$$;

-- 4. 确认打款：累加 total_withdrawn
CREATE OR REPLACE FUNCTION public.confirm_withdrawal_paid(
    p_user_id uuid,
    p_amount  decimal
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.wallets
    SET total_withdrawn = total_withdrawn + p_amount,
        updated_at      = now()
    WHERE user_id = p_user_id;
END;
$$;

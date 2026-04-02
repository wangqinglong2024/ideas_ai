-- ===== 启用所有表 RLS（铁律：任何业务表落地后第一步）=====

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_self_only" ON public.users FOR ALL USING (auth.uid() = id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallets_self_only" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders_self_only" ON public.orders FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commissions_self_only" ON public.commissions FOR SELECT USING (auth.uid() = beneficiary_id);

ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "withdrawals_self_only" ON public.withdrawals FOR ALL USING (auth.uid() = user_id);

-- settings：所有人可读（展示价格/公告），写操作只有 service_role
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings_public_read" ON public.settings FOR SELECT USING (true);

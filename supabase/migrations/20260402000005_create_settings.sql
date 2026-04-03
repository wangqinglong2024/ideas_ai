-- 系统配置单行表（id 永远 = 1）
CREATE TABLE public.settings (
    id                  int PRIMARY KEY DEFAULT 1,
    order_price         decimal(10,2) NOT NULL DEFAULT 28.80,
    commission_ratio    decimal(4,2) NOT NULL DEFAULT 0.30,
    min_withdraw_amount decimal(10,2) NOT NULL DEFAULT 50.00,
    ai_cost_per_call    decimal(10,2) NOT NULL DEFAULT 0.80,
    announcement        text,
    updated_at          timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT settings_single_row CHECK (id = 1)
);

INSERT INTO public.settings (id) VALUES (1) ON CONFLICT DO NOTHING;

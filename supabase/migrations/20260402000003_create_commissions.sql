-- 佣金记录（同一订单同一类型唯一，幂等保证）
CREATE TABLE public.commissions (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id uuid NOT NULL REFERENCES public.users(id),
    order_id       uuid NOT NULL REFERENCES public.orders(id),
    type           varchar(20) NOT NULL CHECK (type IN ('self_cashback', 'referral')),
    amount         decimal(10,2) NOT NULL,
    ratio          decimal(4,2) NOT NULL DEFAULT 0.30,
    status         varchar(20) NOT NULL DEFAULT 'settled'
                   CHECK (status IN ('pending', 'settled', 'withdrawn')),
    created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_commissions_order_type ON public.commissions(order_id, type);
CREATE INDEX idx_commissions_beneficiary_id ON public.commissions(beneficiary_id);

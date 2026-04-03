-- 提现申请表
CREATE TABLE public.withdrawals (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        uuid NOT NULL REFERENCES public.users(id),
    amount         decimal(10,2) NOT NULL,
    payee_name     varchar(50) NOT NULL,
    payee_account  varchar(100) NOT NULL,
    payee_method   varchar(20) NOT NULL CHECK (payee_method IN ('wechat', 'alipay')),
    status         varchar(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    admin_note     text,
    created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_withdrawals_user_id ON public.withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON public.withdrawals(status);

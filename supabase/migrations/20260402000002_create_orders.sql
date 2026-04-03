-- 订单表
CREATE TABLE public.orders (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       uuid NOT NULL REFERENCES public.users(id),
    category      varchar(20) NOT NULL CHECK (category IN ('career', 'emotion')),
    input_content text NOT NULL,
    report        jsonb,
    status        varchar(20) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','paid','generating','completed','failed','expired','refunded')),
    amount        decimal(10,2) NOT NULL DEFAULT 28.80,
    payment_no    varchar(64),
    paid_at       timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_paid_at ON public.orders(paid_at);
CREATE UNIQUE INDEX idx_orders_payment_no ON public.orders(payment_no) WHERE payment_no IS NOT NULL;

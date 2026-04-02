-- 用户主表（扩展 auth.users，严禁修改系统表）
CREATE TABLE public.users (
    id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone         varchar(20) UNIQUE NOT NULL,
    wechat_openid varchar(64),
    invite_code   varchar(6) UNIQUE NOT NULL,
    invited_by    uuid REFERENCES public.users(id),
    is_frozen     boolean NOT NULL DEFAULT false,
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_invite_code ON public.users(invite_code);
CREATE INDEX idx_users_invited_by ON public.users(invited_by);

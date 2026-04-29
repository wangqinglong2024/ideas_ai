import type { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { COOKIE, SESSION_ROLLING_SEC } from '@zhiyu/shared-config';
import { randomToken } from '@zhiyu/shared-utils';
import { AppError } from './error.ts';
import { sb } from '../lib/supabase.ts';
import type { Env } from '../env.ts';

export interface AdminUser {
  id: string;
  email: string | null;
  role: 'super_admin';
}

export async function requireAdmin(c: Context, env: Env): Promise<AdminUser> {
  const at = getCookie(c, COOKIE.ACCESS_TOKEN);
  const rt = getCookie(c, COOKIE.REFRESH_TOKEN);
  const existingCsrf = getCookie(c, COOKIE.CSRF);

  let userId: string | null = null;

  // 1) 先用 access token 验证
  if (at) {
    const { data, error } = await sb(env).auth.getUser(at);
    if (!error && data.user) userId = data.user.id;
  }

  // 2) access token 失效但 refresh token 还在 → 静默换新 token（滚动续期）
  if (!userId && rt) {
    const { data, error } = await sb(env).auth.refreshSession({ refresh_token: rt });
    if (!error && data.session && data.user) {
      userId = data.user.id;
      const csrf = existingCsrf ?? randomToken(24);
      setCookie(c, COOKIE.ACCESS_TOKEN, data.session.access_token, {
        httpOnly: true, sameSite: 'Lax', secure: false, path: '/', maxAge: SESSION_ROLLING_SEC,
      });
      setCookie(c, COOKIE.REFRESH_TOKEN, data.session.refresh_token, {
        httpOnly: true, sameSite: 'Lax', secure: false, path: '/', maxAge: SESSION_ROLLING_SEC,
      });
      setCookie(c, COOKIE.CSRF, csrf, {
        httpOnly: false, sameSite: 'Lax', secure: false, path: '/', maxAge: SESSION_ROLLING_SEC,
      });
    }
  }

  if (!userId) throw new AppError(40100, 'auth.required', 401);

  const { data: p } = await sb(env)
    .from('profiles')
    .select('role, is_active')
    .eq('id', userId)
    .maybeSingle();
  const prof = p as { role?: string; is_active?: boolean } | null;
  if (!prof || prof.role !== 'super_admin' || prof.is_active === false) {
    throw new AppError(40300, 'forbidden', 403);
  }
  return { id: userId, email: null, role: 'super_admin' };
}

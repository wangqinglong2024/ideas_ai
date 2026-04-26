import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { and, desc, eq, gt, sql as dsql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import {
  generateOtp,
  hashOtp,
  verifyOtp,
  validatePassword,
  OTP_TTL_MS,
  OTP_RESEND_COOLDOWN_MS,
  OTP_IP_WINDOW_MS,
  OTP_IP_MAX,
  OTP_MAX_ATTEMPTS,
  LOGIN_LOCK_THRESHOLD,
  LOGIN_LOCK_WINDOW_MS,
  buildAdapters,
} from '@zhiyu/sdk';
import { deriveAdapterFlags, loadEnv } from '@zhiyu/config';
import { auditLogs, loginAttempts, otpChallenges } from '@zhiyu/db';
import { db } from '../db.js';
import { supaAdmin } from '../supa.js';
import { setCookie, clearCookie, ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, requireUser } from '../auth-mw.js';

const env = loadEnv();
const adapters = buildAdapters(deriveAdapterFlags(env));

const OTP_SALT = env.JWT_SECRET;

// ---------- helpers ----------
async function logAttempt(email: string, ip: string | null, ok: boolean, reason?: string): Promise<void> {
  await db.insert(loginAttempts).values({ email, ip, ok, reason: reason ?? null });
}

async function isLocked(email: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - LOGIN_LOCK_WINDOW_MS);
  const rows = await db
    .select({ ok: loginAttempts.ok })
    .from(loginAttempts)
    .where(and(eq(loginAttempts.email, email), gt(loginAttempts.attemptedAt, cutoff)))
    .orderBy(desc(loginAttempts.attemptedAt))
    .limit(LOGIN_LOCK_THRESHOLD);
  if (rows.length < LOGIN_LOCK_THRESHOLD) return false;
  return rows.every((r) => !r.ok);
}

async function audit(action: string, userId: string | null, ip: string | null, meta?: Record<string, unknown>): Promise<void> {
  await db.insert(auditLogs).values({
    action,
    userId,
    actor: userId ?? 'anon',
    ip,
    meta: meta ? meta : null,
  });
}

async function checkOtpRate(email: string, ip: string, purpose: string): Promise<{ ok: boolean; reason?: string }> {
  // 60s per (email, purpose)
  const last = await db
    .select({ createdAt: otpChallenges.createdAt })
    .from(otpChallenges)
    .where(and(eq(otpChallenges.email, email), eq(otpChallenges.purpose, purpose)))
    .orderBy(desc(otpChallenges.createdAt))
    .limit(1);
  if (last[0] && Date.now() - last[0].createdAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return { ok: false, reason: 'auth.otp_cooldown' };
  }
  // 5/IP/5min
  const cutoff = new Date(Date.now() - OTP_IP_WINDOW_MS);
  const ipCount = await db
    .select({ c: dsql<number>`count(*)::int` })
    .from(otpChallenges)
    .where(and(eq(otpChallenges.ip, ip), gt(otpChallenges.createdAt, cutoff)));
  if ((ipCount[0]?.c ?? 0) >= OTP_IP_MAX) {
    return { ok: false, reason: 'auth.too_many_attempts' };
  }
  return { ok: true };
}

async function issueOtp(email: string, purpose: 'signup' | 'reset_password' | 'delete_account', ip: string): Promise<{ challengeId: string; code: string }> {
  const code = generateOtp(6);
  const codeHash = hashOtp(code, OTP_SALT);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const id = randomUUID();
  await db.insert(otpChallenges).values({
    id,
    email,
    purpose,
    codeHash,
    expiresAt,
    ip,
  });
  await adapters.email.send({
    to: email,
    subject: `[知语 Zhiyu] 验证码：${code}`,
    html: `<p>您的 ${purpose} 验证码：<b>${code}</b>，10 分钟内有效。</p>`,
  });
  return { challengeId: id, code };
}

function setSessionCookies(reply: FastifyReply, accessToken: string, refreshToken: string | null, expiresIn: number): void {
  setCookie(reply, ACCESS_TOKEN_COOKIE, accessToken, expiresIn);
  if (refreshToken) setCookie(reply, REFRESH_TOKEN_COOKIE, refreshToken, 60 * 60 * 24 * 30);
}

// ---------- routes ----------
export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  const signUpSchema = z.object({
    email: z.string().email().max(254),
    locale: z.string().max(10).optional(),
  });

  app.post('/api/v1/auth/sign-up', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload', issues: parsed.error.issues };
    }
    const { email } = parsed.data;
    const ip = req.ip;
    const rate = await checkOtpRate(email, ip, 'signup');
    if (!rate.ok) {
      reply.code(429);
      return { error: rate.reason };
    }
    const { challengeId, code } = await issueOtp(email, 'signup', ip);
    // dev convenience: surface code in response when fake adapter is in use.
    const exposeCode = !env.RESEND_API_KEY;
    await audit('auth.otp.issued', null, ip, { email, purpose: 'signup' });
    return { challenge_id: challengeId, ...(exposeCode ? { dev_code: code } : {}) };
  });

  const verifySchema = z.object({
    challenge_id: z.string().uuid(),
    code: z.string().regex(/^\d{6}$/),
    password: z.string().min(8).optional(),
    display_name: z.string().min(1).max(40).optional(),
    locale: z.string().max(10).optional(),
  });

  app.post('/api/v1/auth/verify-otp', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload', issues: parsed.error.issues };
    }
    const { challenge_id, code, password, display_name, locale } = parsed.data;
    const rows = await db
      .select()
      .from(otpChallenges)
      .where(eq(otpChallenges.id, challenge_id))
      .limit(1);
    const row = rows[0];
    if (!row) {
      reply.code(400);
      return { error: 'auth.otp_not_found' };
    }
    if (row.consumedAt) {
      reply.code(400);
      return { error: 'auth.otp_consumed' };
    }
    if (row.expiresAt.getTime() < Date.now()) {
      reply.code(400);
      return { error: 'auth.otp_expired' };
    }
    if (row.attempts >= OTP_MAX_ATTEMPTS) {
      reply.code(429);
      return { error: 'auth.too_many_attempts' };
    }
    if (!verifyOtp(code, row.codeHash, OTP_SALT)) {
      await db
        .update(otpChallenges)
        .set({ attempts: row.attempts + 1 })
        .where(eq(otpChallenges.id, challenge_id));
      reply.code(400);
      return { error: 'auth.otp_invalid' };
    }
    await db
      .update(otpChallenges)
      .set({ consumedAt: new Date() })
      .where(eq(otpChallenges.id, challenge_id));

    if (row.purpose !== 'signup') {
      reply.code(400);
      return { error: 'auth.otp_purpose_mismatch' };
    }

    // Create supabase user (or attach password if exists).
    const finalPassword = password && validatePassword(password).ok ? password : `Otp-${randomUUID()}1!`;
    const { data: created, error: createErr } = await supaAdmin.auth.admin.createUser({
      email: row.email,
      password: finalPassword,
      email_confirm: true,
      user_metadata: { display_name: display_name ?? null, locale: locale ?? 'en' },
    });
    if (createErr || !created.user) {
      reply.code(400);
      return { error: 'auth.signup_failed', detail: createErr?.message };
    }
    // Issue session via password grant on supabase auth.
    const { data: sess, error: sessErr } = await supaAdmin.auth.signInWithPassword({
      email: row.email,
      password: finalPassword,
    });
    if (sessErr || !sess.session) {
      reply.code(500);
      return { error: 'auth.session_failed' };
    }
    setSessionCookies(reply, sess.session.access_token, sess.session.refresh_token, sess.session.expires_in ?? 3600);
    await audit('auth.signup.ok', created.user.id, req.ip, { email: row.email });
    return {
      user: { id: created.user.id, email: created.user.email },
      access_token: sess.session.access_token,
      expires_in: sess.session.expires_in,
    };
  });

  // --- sign-in (password) ---
  const signInSchema = z.object({
    email: z.string().email().max(254),
    password: z.string().min(1).max(200),
  });

  app.post('/api/v1/auth/sign-in', async (req: FastifyRequest, reply: FastifyReply) => {
    const parsed = signInSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload' };
    }
    const { email, password } = parsed.data;
    const ip = req.ip;
    if (await isLocked(email)) {
      reply.code(423);
      return { error: 'auth.account_locked', retry_after_seconds: 900 };
    }
    const { data, error } = await supaAdmin.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      await logAttempt(email, ip, false, error?.message ?? 'no_session');
      await audit('auth.signin.fail', null, ip, { email });
      reply.code(401);
      return { error: 'auth.invalid_credentials' };
    }
    await logAttempt(email, ip, true);
    setSessionCookies(reply, data.session.access_token, data.session.refresh_token, data.session.expires_in ?? 3600);
    await audit('auth.signin.ok', data.user?.id ?? null, ip);
    return {
      user: { id: data.user?.id, email: data.user?.email },
      access_token: data.session.access_token,
      expires_in: data.session.expires_in,
    };
  });

  // --- sign-out ---
  app.post('/api/v1/auth/sign-out', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    await audit('auth.signout', user.id, req.ip);
    clearCookie(reply, ACCESS_TOKEN_COOKIE);
    clearCookie(reply, REFRESH_TOKEN_COOKIE);
    return { ok: true };
  });

  // --- OAuth provider availability + redirect ---
  app.get('/api/v1/auth/providers', async () => {
    // Self-host config: provider keys live in supabase studio; not knowable here,
    // so we expose feature flags from env. Default to disabled when not set.
    const google = process.env.OAUTH_GOOGLE_ENABLED === 'true';
    const apple = process.env.OAUTH_APPLE_ENABLED === 'true';
    return { providers: { google, apple } };
  });

  const oauthSchema = z.object({ provider: z.enum(['google', 'apple']) });
  app.get('/api/v1/auth/oauth/:provider', async (req, reply) => {
    const parsed = oauthSchema.safeParse(req.params);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_provider' };
    }
    const provider = parsed.data.provider;
    const enabled = process.env[`OAUTH_${provider.toUpperCase()}_ENABLED`] === 'true';
    if (!enabled) {
      reply.code(404);
      return { error: 'provider_not_configured' };
    }
    const redirectTo = `${env.SUPABASE_URL.replace('supabase-kong:8000', '115.159.109.23:8000')}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent('http://115.159.109.23:3100/auth/callback')}`;
    reply.redirect(302, redirectTo);
  });

  // OAuth callback: supabase performs PKCE exchange and lands on this URL with code.
  // We accept access_token + refresh_token in body (FE posts them after #fragment parse).
  const callbackSchema = z.object({
    access_token: z.string().min(20),
    refresh_token: z.string().min(20),
    expires_in: z.number().optional(),
  });
  app.post('/api/v1/auth/callback', async (req, reply) => {
    const parsed = callbackSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload' };
    }
    const { access_token, refresh_token, expires_in } = parsed.data;
    setSessionCookies(reply, access_token, refresh_token, expires_in ?? 3600);
    const { data } = await supaAdmin.auth.getUser(access_token);
    await audit('auth.oauth.callback', data.user?.id ?? null, req.ip);
    return { ok: true };
  });

  // --- reset password ---
  const resetReqSchema = z.object({ email: z.string().email().max(254) });
  app.post('/api/v1/auth/reset-password', async (req, reply) => {
    const parsed = resetReqSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload' };
    }
    const { email } = parsed.data;
    const ip = req.ip;
    const rate = await checkOtpRate(email, ip, 'reset_password');
    if (!rate.ok) {
      reply.code(429);
      return { error: rate.reason };
    }
    const { challengeId, code } = await issueOtp(email, 'reset_password', ip);
    const exposeCode = !env.RESEND_API_KEY;
    await audit('auth.reset.requested', null, ip, { email });
    return { challenge_id: challengeId, ...(exposeCode ? { dev_code: code } : {}) };
  });

  const resetConfirmSchema = z.object({
    challenge_id: z.string().uuid(),
    code: z.string().regex(/^\d{6}$/),
    new_password: z.string().min(10).max(200),
  });
  app.post('/api/v1/auth/reset-password/confirm', async (req, reply) => {
    const parsed = resetConfirmSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload' };
    }
    const { challenge_id, code, new_password } = parsed.data;
    const policy = validatePassword(new_password);
    if (!policy.ok) {
      reply.code(400);
      return { error: `auth.${policy.reason}` };
    }
    const rows = await db.select().from(otpChallenges).where(eq(otpChallenges.id, challenge_id)).limit(1);
    const row = rows[0];
    if (!row || row.purpose !== 'reset_password') {
      reply.code(400);
      return { error: 'auth.otp_not_found' };
    }
    if (row.consumedAt) {
      reply.code(400);
      return { error: 'auth.otp_consumed' };
    }
    if (row.expiresAt.getTime() < Date.now()) {
      reply.code(400);
      return { error: 'auth.otp_expired' };
    }
    if (!verifyOtp(code, row.codeHash, OTP_SALT)) {
      await db.update(otpChallenges).set({ attempts: row.attempts + 1 }).where(eq(otpChallenges.id, challenge_id));
      reply.code(400);
      return { error: 'auth.otp_invalid' };
    }
    // Find user by email.
    const list = await supaAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const target = list.data.users.find((u) => u.email?.toLowerCase() === row.email.toLowerCase());
    if (!target) {
      reply.code(404);
      return { error: 'auth.user_not_found' };
    }
    const { error: updErr } = await supaAdmin.auth.admin.updateUserById(target.id, { password: new_password });
    if (updErr) {
      reply.code(400);
      return { error: 'auth.password_update_failed', detail: updErr.message };
    }
    await db.update(otpChallenges).set({ consumedAt: new Date() }).where(eq(otpChallenges.id, challenge_id));
    await audit('auth.reset.ok', target.id, req.ip);
    return { ok: true };
  });

  // --- whoami ---
  app.get('/api/v1/auth/me', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    return { user };
  });
}

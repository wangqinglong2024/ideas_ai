import bcrypt from 'bcryptjs';
import express from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';
import { captchaAdapter, emailAdapter } from '@zhiyu/adapters';
import { readToken, requireAuth, signToken } from '../runtime/auth.js';
import { createBaseApp, installErrorHandler } from '../runtime/base-app.js';
import { audit, defaultPreferences, now, publicUser, state } from '../runtime/state.js';
import { created, failure, ok, pageMeta } from '../runtime/response.js';

const rateLimitHandler = (_req: express.Request, res: express.Response) => failure(res, 429, 'RATE_LIMITED', 'Too many requests');
const authLimiter = rateLimit({ windowMs: 60_000, limit: 10, standardHeaders: true, legacyHeaders: false, handler: rateLimitHandler });
const otpLimiter = rateLimit({ windowMs: 60_000, limit: 1, standardHeaders: true, legacyHeaders: false, handler: rateLimitHandler });
const asyncRoute = (handler: express.RequestHandler): express.RequestHandler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function validPassword(password: unknown) {
  return typeof password === 'string' && password.length >= 8;
}

function userByEmail(email: string) {
  return state.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function issueSession(env: ReturnType<typeof createBaseApp>['env'], user: (typeof state.users)[number], deviceId = 'browser') {
  const session = { id: randomUUID(), userId: user.id, deviceName: deviceId, ip: '127.0.0.1', lastActiveAt: now(), revokedAt: null };
  state.sessions.push(session);
  const accessToken = signToken(env, { userId: user.id, email: user.email, kind: 'user', sessionId: session.id, tokenUse: 'access' }, '15m');
  const refreshToken = signToken(env, { userId: user.id, email: user.email, kind: 'user', sessionId: session.id, tokenUse: 'refresh' }, '30d');
  return { session, accessToken, refreshToken };
}

function activeUser(req: express.Request, res: express.Response) {
  const user = state.users.find((item) => item.id === req.auth?.userId);
  if (!user) {
    failure(res, 404, 'USER_NOT_FOUND', 'User not found');
    return null;
  }
  if (user.status !== 'active') {
    failure(res, 403, 'ACCOUNT_RESTRICTED', 'Account is not active');
    return null;
  }
  return user;
}

function hasValidUserToken(req: express.Request, env: ReturnType<typeof createBaseApp>['env']) {
  const token = readToken(req, 'user');
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { kind?: string; tokenUse?: string; userId?: string };
    return decoded.kind === 'user' && decoded.tokenUse !== 'refresh' && state.users.some((user) => user.id === decoded.userId && user.status === 'active');
  } catch {
    return false;
  }
}

function registerAuthRoutes(router: express.Router, env: ReturnType<typeof createBaseApp>['env']) {
  router.post('/register', authLimiter, asyncRoute(async (req, res) => {
    const { email, password, native_lang, nativeLang, privacyAccepted, turnstile_token } = req.body ?? {};
    if (!email || !password || privacyAccepted !== true) return failure(res, 400, 'REGISTER_INVALID', 'email, password and privacy consent are required');
    if (!validPassword(password)) return failure(res, 400, 'PASSWORD_INVALID', 'Password must be at least 8 characters');
    const captcha = await captchaAdapter.verify(turnstile_token);
    if (!captcha.data.ok) return failure(res, 400, 'CAPTCHA_FAILED', 'Captcha verification failed');
    if (userByEmail(email)) return failure(res, 409, 'EMAIL_EXISTS', 'Email already registered');
    const user = {
      id: randomUUID(),
      email,
      passwordHash: bcrypt.hashSync(password, 12),
      emailVerifiedAt: null,
      displayName: email.split('@')[0],
      avatarUrl: null,
      nativeLang: native_lang ?? nativeLang ?? 'en',
      uiLang: native_lang ?? nativeLang ?? 'en',
      timezone: 'UTC',
      hskLevelSelf: null,
      hskLevelEstimated: null,
      personaTags: [],
      status: 'active' as const,
      coins: 100,
      createdAt: now()
    };
    state.users.push(user);
    state.preferences.set(user.id, { ...defaultPreferences, emailMarketing: true });
    state.otps.push({ userId: user.id, email, code: '123456', purpose: 'verify_email', expiresAt: Date.now() + 15 * 60_000, attempts: 0 });
    await emailAdapter.send({ to: email, subject: 'Verify your Zhiyu email', text: 'Your dev OTP is 123456', locale: user.uiLang });
    return created(res, { user: publicUser(user), grantedCoins: 100, otpDevCode: '123456' });
  }));

  router.post('/login', authLimiter, (req, res) => {
    const { email, password, device_id } = req.body ?? {};
    const user = userByEmail(email ?? '');
    if (!user || !bcrypt.compareSync(password ?? '', user.passwordHash)) return failure(res, 401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
    if (user.status !== 'active') return failure(res, 403, 'ACCOUNT_RESTRICTED', 'Account is not active');
    const tokens = issueSession(env, user, device_id ?? 'browser');
    res.cookie('zy_session', tokens.accessToken, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 15 * 60_000 });
    return ok(res, { user: publicUser(user), ...tokens });
  });

  router.post('/oauth/google', authLimiter, (req, res) => {
    const { id_token, device_id } = req.body ?? {};
    if (!id_token || id_token === 'missing') return failure(res, 503, 'OAUTH_FAKE_PROVIDER', 'Google provider is configured but no dev token was supplied');
    let user = userByEmail('google-dev@example.com');
    if (!user) {
      user = {
        id: randomUUID(),
        email: 'google-dev@example.com',
        passwordHash: bcrypt.hashSync('Password123!', 12),
        emailVerifiedAt: now(),
        displayName: 'Google Dev User',
        avatarUrl: null,
        nativeLang: 'en',
        uiLang: 'en',
        timezone: 'UTC',
        hskLevelSelf: null,
        hskLevelEstimated: null,
        personaTags: [],
        status: 'active',
        coins: 100,
        createdAt: now()
      };
      state.users.push(user);
      state.preferences.set(user.id, { ...defaultPreferences });
    }
    const tokens = issueSession(env, user, device_id ?? 'google-oauth');
    return ok(res, { user: publicUser(user), onboardingRequired: true, grantedCoins: 100, ...tokens });
  });

  router.post('/refresh', (req, res) => {
    const token = req.body?.refresh_token;
    if (!token) return failure(res, 400, 'REFRESH_REQUIRED', 'refresh_token is required');
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { userId?: string; email?: string; kind?: string; sessionId?: string; tokenUse?: string };
      const session = state.sessions.find((item) => item.id === decoded.sessionId && item.userId === decoded.userId && !item.revokedAt);
      const user = state.users.find((item) => item.id === decoded.userId && item.status === 'active');
      if (decoded.kind !== 'user' || decoded.tokenUse !== 'refresh' || !session || !user || !decoded.email) return failure(res, 401, 'REFRESH_INVALID', 'Refresh token is invalid or revoked');
      session.lastActiveAt = now();
      return ok(res, { accessToken: signToken(env, { userId: user.id, email: decoded.email, kind: 'user', sessionId: session.id, tokenUse: 'access' }, '15m') });
    } catch {
      return failure(res, 401, 'REFRESH_INVALID', 'Refresh token is invalid or revoked');
    }
  });

  router.post('/logout', requireAuth(env, 'user'), (req, res) => {
    const session = state.sessions.find((item) => item.userId === req.auth?.userId && !item.revokedAt);
    if (session) session.revokedAt = now();
    res.clearCookie('zy_session');
    return ok(res, { loggedOut: true });
  });

  router.post('/logout-all', requireAuth(env, 'user'), (req, res) => {
    for (const session of state.sessions.filter((item) => item.userId === req.auth?.userId)) session.revokedAt = now();
    return ok(res, { revoked: true });
  });

  router.post('/email/send-otp', otpLimiter, requireAuth(env, 'user'), asyncRoute(async (req, res) => {
    const user = state.users.find((item) => item.id === req.auth?.userId);
    if (!user) return failure(res, 404, 'USER_NOT_FOUND', 'User not found');
    const purpose = req.body?.purpose ?? 'verify_email';
    if (purpose !== 'verify_email') return failure(res, 400, 'OTP_PURPOSE_INVALID', 'OTP purpose is not supported');
    state.otps.push({ userId: user.id, email: user.email, code: '123456', purpose, expiresAt: Date.now() + 15 * 60_000, attempts: 0 });
    await emailAdapter.send({ to: user.email, subject: `Zhiyu ${purpose}`, text: 'Your dev OTP is 123456' });
    return ok(res, { sent: true, cooldownSeconds: 60, otpDevCode: '123456' });
  }));

  router.post('/email/verify-otp', requireAuth(env, 'user'), (req, res) => {
    const otp = state.otps.find((item) => item.userId === req.auth?.userId && item.purpose === 'verify_email' && !item.consumedAt);
    if (!otp || otp.expiresAt < Date.now()) return failure(res, 400, 'OTP_INVALID', 'OTP is invalid or expired');
    otp.attempts += 1;
    if (otp.attempts > 5) return failure(res, 429, 'OTP_ATTEMPTS_EXCEEDED', 'Too many OTP attempts');
    if (otp.code !== req.body?.code) return failure(res, 400, 'OTP_INVALID', 'OTP is invalid or expired');
    otp.consumedAt = now();
    const user = state.users.find((item) => item.id === req.auth?.userId);
    if (user) user.emailVerifiedAt = now();
    return ok(res, { verified: true, user: user ? publicUser(user) : null });
  });

  router.post('/password/reset-request', authLimiter, asyncRoute(async (req, res) => {
    const user = userByEmail(req.body?.email ?? '');
    if (user) {
      state.otps.push({ userId: user.id, email: user.email, code: 'RESET123', purpose: 'reset_password', expiresAt: Date.now() + 10 * 60_000, attempts: 0 });
      await emailAdapter.send({ to: user.email, subject: 'Reset your Zhiyu password', text: 'Your dev reset token is RESET123' });
    }
    return ok(res, { sent: true, tokenDevOnly: user ? 'RESET123' : null });
  }));

  router.post('/password/reset', authLimiter, (req, res) => {
    const nextPassword = req.body?.new_password ?? req.body?.new;
    if (!validPassword(nextPassword)) return failure(res, 400, 'PASSWORD_INVALID', 'Password must be at least 8 characters');
    const otp = state.otps.find((item) => item.code === req.body?.token && item.purpose === 'reset_password' && !item.consumedAt && (!req.body?.email || item.email.toLowerCase() === String(req.body.email).toLowerCase()));
    if (!otp || otp.expiresAt < Date.now()) return failure(res, 400, 'RESET_TOKEN_INVALID', 'Reset token is invalid or expired');
    const user = state.users.find((item) => item.id === otp.userId);
    if (user) user.passwordHash = bcrypt.hashSync(nextPassword, 12);
    for (const session of state.sessions.filter((item) => item.userId === otp.userId)) session.revokedAt = now();
    otp.consumedAt = now();
    return ok(res, { reset: true, sessionsRevoked: true });
  });

  router.post('/password/change', requireAuth(env, 'user'), (req, res) => {
    const user = state.users.find((item) => item.id === req.auth?.userId);
    if (!user || !bcrypt.compareSync(req.body?.old ?? '', user.passwordHash)) return failure(res, 401, 'PASSWORD_INVALID', 'Current password is incorrect');
    if (!validPassword(req.body?.new)) return failure(res, 400, 'PASSWORD_INVALID', 'Password must be at least 8 characters');
    user.passwordHash = bcrypt.hashSync(req.body.new, 12);
    return ok(res, { changed: true });
  });
}

function registerMeRoutes(router: express.Router, env: ReturnType<typeof createBaseApp>['env']) {
  router.get('/', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    return ok(res, { profile: publicUser(user), preferences: state.preferences.get(user.id) });
  });

  router.patch('/', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    Object.assign(user, {
      displayName: req.body.display_name ?? req.body.displayName ?? user.displayName,
      nativeLang: req.body.native_lang ?? req.body.nativeLang ?? user.nativeLang,
      uiLang: req.body.ui_lang ?? req.body.uiLang ?? user.uiLang,
      timezone: req.body.timezone ?? user.timezone,
      hskLevelSelf: req.body.hsk_level_self ?? req.body.hskLevelSelf ?? user.hskLevelSelf,
      personaTags: req.body.persona_tags ?? req.body.personaTags ?? user.personaTags
    });
    return ok(res, { profile: publicUser(user) });
  });

  router.patch('/preferences', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    const current = state.preferences.get(user.id) ?? { ...defaultPreferences };
    const next = { ...current, ...req.body };
    state.preferences.set(user.id, next);
    return ok(res, { preferences: next });
  });

  router.get('/sessions', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    return ok(res, state.sessions.filter((item) => item.userId === user.id));
  });
  router.delete('/sessions/:id', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    const session = state.sessions.find((item) => item.id === req.params.id && item.userId === user.id);
    if (!session) return failure(res, 404, 'SESSION_NOT_FOUND', 'Session not found');
    session.revokedAt = now();
    return ok(res, { revoked: true });
  });

  router.post('/avatar', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    user.avatarUrl = req.body?.avatar_url ?? `https://www.gravatar.com/avatar/${user.id}?d=identicon`;
    return ok(res, { avatarUrl: user.avatarUrl });
  });

  router.post('/data-exports', requireAuth(env, 'user'), (req, res) => {
    const user = activeUser(req, res);
    if (!user) return;
    const monthKey = now().slice(0, 7);
    const monthlyExisting = state.exports.find((item) => item['userId'] === user.id && String(item['requestedAt'] ?? '').slice(0, 7) === monthKey);
    if (monthlyExisting) return failure(res, 429, 'EXPORT_MONTHLY_LIMIT', 'Data export is limited to once per month');
    const exportJob = { id: randomUUID(), userId: user.id, status: 'completed', fileUrl: `seed://exports/${user.id}.json`, expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(), requestedAt: now() };
    state.exports.push(exportJob);
    return created(res, exportJob);
  });

  router.get('/data-exports/:id', requireAuth(env, 'user'), (req, res) => {
    const job = state.exports.find((item) => item['id'] === req.params.id && item['userId'] === req.auth?.userId);
    if (!job) return failure(res, 404, 'EXPORT_NOT_FOUND', 'Export not found');
    if (Date.parse(String(job['expiresAt'])) <= Date.now()) return failure(res, 410, 'EXPORT_EXPIRED', 'Export has expired');
    return ok(res, job);
  });

  router.post('/delete-account', requireAuth(env, 'user'), (req, res) => {
    const user = state.users.find((item) => item.id === req.auth?.userId && item.status === 'active');
    if (!user || !bcrypt.compareSync(req.body?.password ?? '', user.passwordHash)) return failure(res, 401, 'PASSWORD_INVALID', 'Password confirmation is required');
    user.status = 'deleted_pending';
    user.coins = 0;
    for (const session of state.sessions.filter((item) => item.userId === user.id)) session.revokedAt = now();
    return ok(res, { status: user.status, restoreUntil: new Date(Date.now() + 90 * 24 * 60 * 60_000).toISOString(), coinsCleared: true });
  });
}

export function createAppApi() {
  const { app, env } = createBaseApp('app-api');
  const authRouter = express.Router();
  const meRouter = express.Router();
  registerAuthRoutes(authRouter, env);
  registerMeRoutes(meRouter, env);

  app.post('/api/v1/_telemetry/error', (req, res) => {
    const event = { id: randomUUID(), ts: now(), service: 'app-fe', ...req.body };
    state.errorEvents.push(event);
    return created(res, event);
  });
  app.post('/api/v1/_telemetry/events', (req, res) => {
    const event = { id: randomUUID(), ts: now(), ...req.body };
    state.events.push(event);
    return created(res, event);
  });

  app.get('/api/v1/discover/categories', (_req, res) => ok(res, state.categories));
  app.get('/api/v1/discover/categories/:slug/articles', (req, res) => {
    const rows = state.articles.filter((item) => item.category === req.params.slug);
    return ok(res, rows.map((item) => ({ ...item, sentences: undefined })), pageMeta(1, rows.length, rows.length));
  });
  app.get('/api/v1/discover/articles/:slug', (req, res) => {
    const article = state.articles.find((item) => item.slug === req.params.slug);
    if (!article) return failure(res, 404, 'ARTICLE_NOT_FOUND', 'Article not found');
    const isPublic = article.public || hasValidUserToken(req, env);
    if (!isPublic) return ok(res, { ...article, sentences: [], locked: true, audioUrl: null });
    return ok(res, article);
  });
  app.get('/api/v1/courses/map', (_req, res) => ok(res, ['daily', 'ecommerce', 'factory', 'hsk'].map((track) => ({ track, stages: 12, chaptersPerStage: 12, free: 'stage-1 chapters 1-3' }))));
  app.get('/api/v1/games', (_req, res) => ok(res, ['hanzi-ninja', 'pinyin-shooter', 'tone-bubbles', 'hanzi-tetris', 'whack-hanzi', 'hanzi-match3', 'hanzi-snake', 'hanzi-rhythm', 'hanzi-runner', 'pinyin-defense', 'memory-match', 'hanzi-slingshot'].map((slug, index) => ({ slug, title: slug.replaceAll('-', ' '), active: true, seconds: 60, recommendedHsk: [(index % 3) + 1] }))));
  app.get('/api/v1/games/:slug/wordpacks', (_req, res) => ok(res, [{ track: 'hsk', stage: 1, available: true }, { track: 'ecommerce', stage: 9, available: Boolean(_req.headers.authorization) }]));
  app.get('/api/v1/novels/preview', (_req, res) => ok(res, [{ slug: 'ancient-romance-demo', freeChapter: 1, loginUnlocksAll: true }]));

  app.use('/api/auth', authRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/me', meRouter);
  app.use('/api/v1/me', meRouter);
  app.post('/api/me/restore-account', requireAuth(env, 'user'), (req, res) => {
    const user = state.users.find((item) => item.id === req.auth?.userId);
    if (user?.status === 'deleted_pending') user.status = 'active';
    return ok(res, { restored: user?.status === 'active' });
  });

  app.use((req, res) => failure(res, 404, 'NOT_FOUND', `No route for ${req.method} ${req.path}`));
  installErrorHandler(app);
  return app;
}
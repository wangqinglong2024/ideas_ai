import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { and, eq, isNull } from 'drizzle-orm';
import { auditLogs, dataExports, pendingDeletes, profiles } from '@zhiyu/db';
import { db } from '../db.js';
import { supaAdmin } from '../supa.js';
import { requireUser, parseCookies, REFRESH_TOKEN_COOKIE, clearCookie, ACCESS_TOKEN_COOKIE } from '../auth-mw.js';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { loadEnv } from '@zhiyu/config';

const env = loadEnv();
const connection = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: true, lazyConnect: false });
const exportQueue = new Queue('gdpr-export', { connection });

export async function registerSessionRoutes(app: FastifyInstance): Promise<void> {
  // GET /me/sessions
  app.get('/api/v1/me/sessions', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    try {
      // GoTrue admin lacks list-by-user; we approximate with our user_devices table later.
      // For v1 we expose the current session only based on getUser refresh metadata.
      const cookies = parseCookies(req);
      const current = cookies[REFRESH_TOKEN_COOKIE] ?? null;
      return {
        sessions: [
          {
            id: 'current',
            current: true,
            user_agent: req.headers['user-agent'] ?? null,
            ip: req.ip,
            has_refresh_cookie: Boolean(current),
            last_seen_at: new Date().toISOString(),
          },
        ],
      };
    } catch (err) {
      req.log?.warn({ err }, 'sessions_list_failed');
      return { sessions: [] };
    }
  });

  const delQuerySchema = z.object({
    keepCurrent: z
      .string()
      .optional()
      .transform((v) => v === 'true'),
  });

  // DELETE /me/sessions — revoke all refresh tokens for the user
  app.delete('/api/v1/me/sessions', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const q = delQuerySchema.safeParse(req.query);
    const keepCurrent = q.success ? q.data.keepCurrent : false;
    try {
      // Best-effort global revoke via gotrue admin user signout.
      // Available on supabase-js v2 as auth.admin.signOut(userId) when targeting GoTrue 2.x.
      const adminAny = supaAdmin.auth.admin as unknown as {
        signOut?: (userId: string, scope?: string) => Promise<{ error?: { message: string } | null }>;
      };
      if (typeof adminAny.signOut === 'function') {
        const r = await adminAny.signOut(user.id, 'global');
        if (r?.error) req.log?.warn({ err: r.error }, 'admin_signout_returned_error');
      }
    } catch (err) {
      req.log?.warn({ err }, 'global_signout_unavailable');
    }
    if (!keepCurrent) {
      clearCookie(reply, ACCESS_TOKEN_COOKIE);
      clearCookie(reply, REFRESH_TOKEN_COOKIE);
    }
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'sessions.revoke_all', ip: req.ip });
    return { ok: true, keep_current: keepCurrent };
  });

  app.delete('/api/v1/me/sessions/:id', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const { id } = req.params as { id: string };
    if (id === 'current') {
      clearCookie(reply, ACCESS_TOKEN_COOKIE);
      clearCookie(reply, REFRESH_TOKEN_COOKIE);
    }
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'sessions.revoke_one', ip: req.ip, meta: { id } });
    return { ok: true };
  });
}

export async function registerGdprRoutes(app: FastifyInstance): Promise<void> {
  // POST /me/export — enqueue export
  app.post('/api/v1/me/export', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const [row] = await db
      .insert(dataExports)
      .values({ userId: user.id, status: 'queued' })
      .returning({ id: dataExports.id });
    if (!row) {
      reply.code(500);
      return { error: 'export.create_failed' };
    }
    await exportQueue.add(
      'export-user-data',
      { exportId: row.id, userId: user.id, email: user.email },
      { removeOnComplete: 200, removeOnFail: 100, attempts: 2 },
    );
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'gdpr.export.enqueued', ip: req.ip });
    return { id: row.id, status: 'queued' };
  });

  app.get('/api/v1/me/exports', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const rows = await db.select().from(dataExports).where(eq(dataExports.userId, user.id));
    return { exports: rows };
  });

  // POST /me/delete — mark pending_delete (30d)
  const deleteSchema = z.object({
    confirm: z.literal('DELETE_MY_ACCOUNT'),
    password: z.string().optional(),
  });
  app.post('/api/v1/me/delete', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const parsed = deleteSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'gdpr.confirm_required' };
    }
    if (parsed.data.password && user.email) {
      const { error } = await supaAdmin.auth.signInWithPassword({ email: user.email, password: parsed.data.password });
      if (error) {
        reply.code(401);
        return { error: 'auth.invalid_credentials' };
      }
    }
    const scheduled = new Date(Date.now() + 30 * 86400_000);
    await db
      .insert(pendingDeletes)
      .values({ userId: user.id, scheduledFor: scheduled })
      .onConflictDoUpdate({
        target: pendingDeletes.userId,
        set: { scheduledFor: scheduled, requestedAt: new Date(), cancelledAt: null, executedAt: null },
      });
    await db.update(profiles).set({ deletedAt: new Date() }).where(eq(profiles.id, user.id));
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'gdpr.delete.requested', ip: req.ip });
    clearCookie(reply, ACCESS_TOKEN_COOKIE);
    clearCookie(reply, REFRESH_TOKEN_COOKIE);
    return { ok: true, scheduled_for: scheduled.toISOString() };
  });

  app.post('/api/v1/me/delete/cancel', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const updated = await db
      .update(pendingDeletes)
      .set({ cancelledAt: new Date() })
      .where(and(eq(pendingDeletes.userId, user.id), isNull(pendingDeletes.executedAt)))
      .returning({ userId: pendingDeletes.userId });
    if (updated.length === 0) {
      reply.code(404);
      return { error: 'gdpr.no_pending_delete' };
    }
    await db.update(profiles).set({ deletedAt: null }).where(eq(profiles.id, user.id));
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'gdpr.delete.cancelled', ip: req.ip });
    return { ok: true };
  });

  app.get('/api/v1/me/delete/status', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const [row] = await db.select().from(pendingDeletes).where(eq(pendingDeletes.userId, user.id)).limit(1);
    if (!row) return { pending: false };
    return {
      pending: !row.cancelledAt && !row.executedAt,
      requested_at: row.requestedAt,
      scheduled_for: row.scheduledFor,
      cancelled_at: row.cancelledAt,
      executed_at: row.executedAt,
    };
  });
}

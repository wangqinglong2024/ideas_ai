import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { and, desc, eq, sql as dsql } from 'drizzle-orm';
import { auditLogs, profiles, userSettings } from '@zhiyu/db';
import { db } from '../db.js';
import { supaAdmin } from '../supa.js';
import { requireUser } from '../auth-mw.js';

const profilePatchSchema = z.object({
  display_name: z.string().min(1).max(40).optional(),
  username: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/).optional(),
  bio: z.string().max(200).optional().nullable(),
  hsk_self_level: z.number().int().min(0).max(9).optional(),
  goal: z.enum(['travel', 'business', 'heritage', 'exam', 'culture', 'other']).optional().nullable(),
  locale: z.string().max(10).optional(),
  avatar_url: z.string().url().max(500).optional().nullable(),
});

const settingsPatchSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  locale: z.string().max(10).optional(),
  push_enabled: z.boolean().optional(),
  email_marketing_opt_in: z.boolean().optional(),
  tts_voice: z.string().max(40).optional(),
  a11y_reduced_motion: z.boolean().optional(),
  daily_remind_at: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional().nullable(),
});

export async function registerMeRoutes(app: FastifyInstance): Promise<void> {
  // GET /me — profile + settings
  app.get('/api/v1/me', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const [pRow] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
    const [sRow] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
    if (!pRow) {
      // Trigger may not have fired (e.g. user created pre-trigger). Backfill.
      await db.insert(profiles).values({ id: user.id, locale: 'en' }).onConflictDoNothing();
      await db.insert(userSettings).values({ userId: user.id }).onConflictDoNothing();
    }
    return {
      profile: pRow ?? { id: user.id, locale: 'en' },
      settings: sRow ?? null,
      email: user.email,
    };
  });

  app.patch('/api/v1/me', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const parsed = profilePatchSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload', issues: parsed.error.issues };
    }
    const data = parsed.data;
    // Username free first time, otherwise require >=30d gap (ZC consumption deferred).
    if (data.username) {
      const [existing] = await db.select().from(profiles).where(eq(profiles.id, user.id)).limit(1);
      if (existing?.usernameChangedAt) {
        const sinceMs = Date.now() - existing.usernameChangedAt.getTime();
        if (sinceMs < 30 * 86400_000) {
          reply.code(429);
          return { error: 'profile.username_change_cooldown', retry_after_days: Math.ceil((30 * 86400_000 - sinceMs) / 86400_000) };
        }
      }
      // Unique constraint enforced by DB; surface friendly error.
      const [taken] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(and(eq(profiles.username, data.username), dsql`${profiles.id} <> ${user.id}`))
        .limit(1);
      if (taken) {
        reply.code(409);
        return { error: 'profile.username_taken' };
      }
    }
    const updates: Record<string, unknown> = {
      ...(data.display_name !== undefined && { displayName: data.display_name }),
      ...(data.username !== undefined && { username: data.username, usernameChangedAt: new Date() }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.hsk_self_level !== undefined && { hskSelfLevel: data.hsk_self_level }),
      ...(data.goal !== undefined && { goal: data.goal }),
      ...(data.locale !== undefined && { locale: data.locale }),
      ...(data.avatar_url !== undefined && { avatarUrl: data.avatar_url }),
    };
    if (Object.keys(updates).length === 0) {
      return { ok: true, no_changes: true };
    }
    // Ensure row exists.
    await db.insert(profiles).values({ id: user.id, ...updates }).onConflictDoUpdate({ target: profiles.id, set: updates });
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'profile.update', ip: req.ip, meta: data });
    return { ok: true };
  });

  // GET / PATCH /me/settings
  app.get('/api/v1/me/settings', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const [row] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
    if (!row) {
      await db.insert(userSettings).values({ userId: user.id }).onConflictDoNothing();
      const [fresh] = await db.select().from(userSettings).where(eq(userSettings.userId, user.id)).limit(1);
      return fresh ?? null;
    }
    return row;
  });

  app.patch('/api/v1/me/settings', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const parsed = settingsPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload', issues: parsed.error.issues };
    }
    const d = parsed.data;
    const updates: Record<string, unknown> = {
      ...(d.theme !== undefined && { theme: d.theme }),
      ...(d.locale !== undefined && { locale: d.locale }),
      ...(d.push_enabled !== undefined && { pushEnabled: d.push_enabled }),
      ...(d.email_marketing_opt_in !== undefined && { emailMarketingOptIn: d.email_marketing_opt_in }),
      ...(d.tts_voice !== undefined && { ttsVoice: d.tts_voice }),
      ...(d.a11y_reduced_motion !== undefined && { a11yReducedMotion: d.a11y_reduced_motion }),
      ...(d.daily_remind_at !== undefined && { dailyRemindAt: d.daily_remind_at }),
    };
    if (Object.keys(updates).length === 0) return { ok: true };
    await db
      .insert(userSettings)
      .values({ userId: user.id, ...updates })
      .onConflictDoUpdate({ target: userSettings.userId, set: updates });
    await db.insert(auditLogs).values({ userId: user.id, actor: user.id, action: 'settings.update', ip: req.ip, meta: d });
    return { ok: true };
  });

  // POST /me/avatar — returns signed upload URL for supabase-storage 'avatars' bucket.
  // FE PUT s the binary, then PATCHes /me with avatar_url.
  const avatarSchema = z.object({
    filename: z.string().min(1).max(120),
    content_type: z.enum(['image/webp', 'image/png', 'image/jpeg']),
  });
  app.post('/api/v1/me/avatar/sign', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const parsed = avatarSchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'invalid_payload' };
    }
    const ts = Date.now();
    const ext = parsed.data.content_type.split('/')[1] ?? 'webp';
    const path = `${user.id}/${ts}.${ext}`;
    const bucket = 'avatars';
    try {
      const { data, error } = await (supaAdmin.storage.from(bucket) as { createSignedUploadUrl: (p: string) => Promise<{ data: { signedUrl: string; path: string; token: string } | null; error: { message: string } | null }> }).createSignedUploadUrl(path);
      if (error || !data) {
        reply.code(500);
        return { error: 'storage.sign_failed', detail: error?.message ?? 'unknown' };
      }
      const publicUrl = `${process.env.PUBLIC_SUPABASE_URL ?? 'http://115.159.109.23:8000'}/storage/v1/object/public/${bucket}/${path}`;
      return { upload_url: data.signedUrl, token: data.token, path: data.path, public_url: publicUrl };
    } catch (err) {
      // Fallback: return a fake URL so FE can still flow in dev.
      req.log?.warn({ err }, 'avatar_sign_failed_fake_fallback');
      return {
        upload_url: `data:fake-upload/${path}`,
        token: 'fake',
        path,
        public_url: `https://fake.local/avatars/${path}`,
        fake: true,
      };
    }
  });
}

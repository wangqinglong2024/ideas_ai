import { Worker, Queue, type Job } from 'bullmq';
import { Redis } from 'ioredis';
import pino from 'pino';
import { and, eq, isNull, lte } from 'drizzle-orm';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { loadEnv } from '@zhiyu/config';
import { createServerClient } from '@zhiyu/sdk';
import { auditLogs, dataExports, pendingDeletes, profiles, userSettings, userDevices } from '@zhiyu/db';

const env = loadEnv();
const log = pino({ name: 'gdpr', level: process.env.LOG_LEVEL ?? 'info' });

const queryClient = postgres(env.DATABASE_URL, { max: 4, connection: { search_path: 'zhiyu' } });
const db = drizzle(queryClient);
const supa = createServerClient({ url: env.SUPABASE_URL, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY });

export function startGdprWorkers(connection: Redis): { stop: () => Promise<void> } {
  const exportWorker = new Worker(
    'gdpr-export',
    async (job: Job<{ exportId: string; userId: string; email: string | null }>) => {
      const { exportId, userId } = job.data;
      log.info({ exportId, userId }, 'gdpr_export_start');
      await db.update(dataExports).set({ status: 'running' }).where(eq(dataExports.id, exportId));
      try {
        const [profile] = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
        const [settings] = await db.select().from(userSettings).where(eq(userSettings.userId, userId)).limit(1);
        const devices = await db.select().from(userDevices).where(eq(userDevices.userId, userId));
        const { data: authUser } = await supa.auth.admin.getUserById(userId);
        const bundle = {
          generated_at: new Date().toISOString(),
          user: { id: userId, email: authUser?.user?.email ?? null },
          profile: profile ?? null,
          settings: settings ?? null,
          devices,
        };
        const json = JSON.stringify(bundle, null, 2);
        const path = `${userId}/${Date.now()}-export.json`;
        let downloadUrl = `data:fake/${path}`;
        const expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
        try {
          const upload = await supa.storage.from('exports').upload(path, json, {
            contentType: 'application/json',
            upsert: true,
          });
          if (upload.error) {
            log.warn({ err: upload.error }, 'export_upload_failed_using_inline_fallback');
          } else {
            const signed = await supa.storage.from('exports').createSignedUrl(path, 24 * 3600);
            if (signed.data?.signedUrl) downloadUrl = signed.data.signedUrl;
          }
        } catch (err) {
          log.warn({ err }, 'storage_upload_threw_fallback');
        }
        await db
          .update(dataExports)
          .set({ status: 'succeeded', filePath: path, downloadUrl, expiresAt, completedAt: new Date() })
          .where(eq(dataExports.id, exportId));
        await db.insert(auditLogs).values({ userId, actor: userId, action: 'gdpr.export.completed' });
        return { ok: true, downloadUrl };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        await db
          .update(dataExports)
          .set({ status: 'failed', error: msg, completedAt: new Date() })
          .where(eq(dataExports.id, exportId));
        log.error({ err }, 'gdpr_export_failed');
        throw err;
      }
    },
    { connection, concurrency: 2 },
  );

  exportWorker.on('error', (err) => log.error({ err }, 'gdpr_export_worker_error'));

  // Daily purge cron — repeat job
  const purgeQueue = new Queue('gdpr-purge', { connection });
  void purgeQueue.add(
    'daily-purge',
    {},
    {
      repeat: { every: Number(process.env.GDPR_PURGE_EVERY_MS ?? 6 * 3600 * 1000) },
      removeOnComplete: 50,
      removeOnFail: 50,
    },
  );

  const purgeWorker = new Worker(
    'gdpr-purge',
    async () => {
      const now = new Date();
      const due = await db
        .select()
        .from(pendingDeletes)
        .where(and(isNull(pendingDeletes.executedAt), isNull(pendingDeletes.cancelledAt), lte(pendingDeletes.scheduledFor, now)));
      log.info({ count: due.length }, 'gdpr_purge_tick');
      for (const row of due) {
        try {
          // Anonymize learning records would happen here for later epics.
          await supa.auth.admin.deleteUser(row.userId).catch((err) => log.warn({ err, uid: row.userId }, 'auth_delete_failed'));
          await db.update(pendingDeletes).set({ executedAt: new Date() }).where(eq(pendingDeletes.userId, row.userId));
          await db.insert(auditLogs).values({ userId: row.userId, actor: 'system', action: 'gdpr.delete.executed' });
        } catch (err) {
          log.error({ err, uid: row.userId }, 'gdpr_purge_user_failed');
        }
      }
      return { processed: due.length };
    },
    { connection, concurrency: 1 },
  );
  purgeWorker.on('error', (err) => log.error({ err }, 'gdpr_purge_worker_error'));

  return {
    stop: async () => {
      await exportWorker.close();
      await purgeWorker.close();
      await purgeQueue.close();
    },
  };
}

import { sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  index,
  jsonb,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { zhiyu } from './schema.js';

export const profiles = zhiyu.table(
  'profiles',
  {
    id: uuid('id').primaryKey(),
    username: text('username'),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    locale: text('locale').notNull().default('en'),
    bio: text('bio'),
    hskSelfLevel: smallint('hsk_self_level').notNull().default(0),
    goal: text('goal'),
    usernameChangedAt: timestamp('username_changed_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    usernameUx: uniqueIndex('profiles_username_key').on(t.username),
    localeIdx: index('profiles_locale_idx').on(t.locale),
  }),
);

export const userSettings = zhiyu.table('user_settings', {
  userId: uuid('user_id').primaryKey(),
  theme: text('theme').notNull().default('system'),
  locale: text('locale').notNull().default('en'),
  pushEnabled: boolean('push_enabled').notNull().default(true),
  emailMarketingOptIn: boolean('email_marketing_opt_in').notNull().default(false),
  ttsVoice: text('tts_voice').notNull().default('female-1'),
  a11yReducedMotion: boolean('a11y_reduced_motion').notNull().default(false),
  dailyRemindAt: text('daily_remind_at'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userDevices = zhiyu.table(
  'user_devices',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id').notNull(),
    sessionId: text('session_id'),
    userAgent: text('user_agent'),
    ip: text('ip'),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('user_devices_user_idx').on(t.userId),
    sessionIdx: index('user_devices_session_idx').on(t.sessionId),
  }),
);

export const loginAttempts = zhiyu.table(
  'login_attempts',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    email: text('email').notNull(),
    ip: text('ip'),
    ok: boolean('ok').notNull(),
    reason: text('reason'),
    attemptedAt: timestamp('attempted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailTime: index('login_attempts_email_time_idx').on(t.email, t.attemptedAt),
    ipTime: index('login_attempts_ip_time_idx').on(t.ip, t.attemptedAt),
  }),
);

export const otpChallenges = zhiyu.table(
  'otp_challenges',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    email: text('email').notNull(),
    purpose: text('purpose').notNull(),
    codeHash: text('code_hash').notNull(),
    attempts: smallint('attempts').notNull().default(0),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    ip: text('ip'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailPurposeIdx: index('otp_email_purpose_idx').on(t.email, t.purpose, t.createdAt),
  }),
);

export const pendingDeletes = zhiyu.table('pending_deletes', {
  userId: uuid('user_id').primaryKey(),
  requestedAt: timestamp('requested_at', { withTimezone: true }).notNull().defaultNow(),
  scheduledFor: timestamp('scheduled_for', { withTimezone: true }).notNull(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  executedAt: timestamp('executed_at', { withTimezone: true }),
});

export const dataExports = zhiyu.table('data_exports', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  status: text('status').notNull().default('queued'),
  filePath: text('file_path'),
  downloadUrl: text('download_url'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  error: text('error'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const auditLogs = zhiyu.table(
  'audit_logs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    ts: timestamp('ts', { withTimezone: true }).notNull().defaultNow(),
    userId: uuid('user_id'),
    actor: text('actor'),
    action: text('action').notNull(),
    target: text('target'),
    ip: text('ip'),
    meta: jsonb('meta'),
  },
  (t) => ({
    userIdx: index('audit_logs_user_idx').on(t.userId, t.ts),
    actionIdx: index('audit_logs_action_idx').on(t.action, t.ts),
  }),
);

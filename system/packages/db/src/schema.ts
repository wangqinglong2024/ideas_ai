import { pgSchema, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const zhiyu = pgSchema('zhiyu');

export const meta = zhiyu.table('_meta', {
  id: serial('id').primaryKey(),
  version: text('version').notNull(),
  appliedAt: timestamp('applied_at', { withTimezone: true }).defaultNow().notNull(),
});

export const errorEvents = zhiyu.table('error_events', {
  id: serial('id').primaryKey(),
  ts: timestamp('ts', { withTimezone: true }).defaultNow().notNull(),
  env: text('env').notNull(),
  service: text('service').notNull(),
  version: text('version'),
  level: text('level').notNull(),
  fingerprint: text('fingerprint'),
  message: text('message').notNull(),
  stack: text('stack'),
  context: text('context'),
});

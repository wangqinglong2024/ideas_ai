-- Initial _meta + error_events tables under schema `zhiyu`.
CREATE SCHEMA IF NOT EXISTS zhiyu;

-- _meta is also created by the migration runner; CREATE IF NOT EXISTS keeps idempotency.
CREATE TABLE IF NOT EXISTS zhiyu._meta (
  id          serial PRIMARY KEY,
  version     text NOT NULL UNIQUE,
  applied_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS zhiyu.error_events (
  id          serial PRIMARY KEY,
  ts          timestamptz NOT NULL DEFAULT now(),
  env         text NOT NULL,
  service     text NOT NULL,
  version     text,
  level       text NOT NULL,
  fingerprint text,
  message     text NOT NULL,
  stack       text,
  context     text
);

CREATE INDEX IF NOT EXISTS error_events_ts_idx ON zhiyu.error_events(ts DESC);
CREATE INDEX IF NOT EXISTS error_events_fingerprint_idx ON zhiyu.error_events(fingerprint);

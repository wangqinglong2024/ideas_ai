-- E03 user account: profiles + settings + devices + login_attempts + otp_challenges
-- + pending_deletes + audit_logs + handle_new_user trigger + RLS policies.

CREATE SCHEMA IF NOT EXISTS zhiyu;

-- =========================================================
-- profiles (1:1 auth.users)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.profiles (
  id              uuid PRIMARY KEY,
  username        text UNIQUE,
  display_name    text,
  avatar_url      text,
  locale          text NOT NULL DEFAULT 'en',
  bio             text,
  hsk_self_level  smallint NOT NULL DEFAULT 0,
  goal            text,
  username_changed_at timestamptz,
  deleted_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_username_len CHECK (
    username IS NULL OR (char_length(username) BETWEEN 3 AND 20)
  ),
  CONSTRAINT profiles_hsk_range CHECK (hsk_self_level BETWEEN 0 AND 9),
  CONSTRAINT profiles_bio_len CHECK (bio IS NULL OR char_length(bio) <= 200)
);

-- FK to auth.users (best effort — silently skip if auth schema not available)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='auth') THEN
    BEGIN
      ALTER TABLE zhiyu.profiles
        ADD CONSTRAINT profiles_id_fkey
        FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
    EXCEPTION WHEN duplicate_object THEN
      NULL;
    END;
  END IF;
END$$;

CREATE INDEX IF NOT EXISTS profiles_locale_idx ON zhiyu.profiles(locale);
CREATE INDEX IF NOT EXISTS profiles_deleted_at_idx ON zhiyu.profiles(deleted_at);

-- updated_at trigger
CREATE OR REPLACE FUNCTION zhiyu.set_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END$$;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON zhiyu.profiles;
CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON zhiyu.profiles
  FOR EACH ROW EXECUTE FUNCTION zhiyu.set_updated_at();

-- =========================================================
-- user_settings (1:1 profiles)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.user_settings (
  user_id                 uuid PRIMARY KEY REFERENCES zhiyu.profiles(id) ON DELETE CASCADE,
  theme                   text NOT NULL DEFAULT 'system',
  locale                  text NOT NULL DEFAULT 'en',
  push_enabled            boolean NOT NULL DEFAULT true,
  email_marketing_opt_in  boolean NOT NULL DEFAULT false,
  tts_voice               text NOT NULL DEFAULT 'female-1',
  a11y_reduced_motion     boolean NOT NULL DEFAULT false,
  daily_remind_at         text,
  updated_at              timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_theme_chk CHECK (theme IN ('light','dark','system'))
);

DROP TRIGGER IF EXISTS user_settings_set_updated_at ON zhiyu.user_settings;
CREATE TRIGGER user_settings_set_updated_at
  BEFORE UPDATE ON zhiyu.user_settings
  FOR EACH ROW EXECUTE FUNCTION zhiyu.set_updated_at();

-- =========================================================
-- user_devices (informational; supabase auth keeps real refresh tokens)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.user_devices (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES zhiyu.profiles(id) ON DELETE CASCADE,
  session_id   text,
  user_agent   text,
  ip           text,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS user_devices_user_idx ON zhiyu.user_devices(user_id);
CREATE INDEX IF NOT EXISTS user_devices_session_idx ON zhiyu.user_devices(session_id);

-- =========================================================
-- login_attempts (5 fail / 15 min lock)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.login_attempts (
  id          bigserial PRIMARY KEY,
  email       text NOT NULL,
  ip          text,
  ok          boolean NOT NULL,
  reason      text,
  attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_attempts_email_time_idx ON zhiyu.login_attempts(email, attempted_at DESC);
CREATE INDEX IF NOT EXISTS login_attempts_ip_time_idx ON zhiyu.login_attempts(ip, attempted_at DESC);

-- =========================================================
-- otp_challenges (signup + reset password OTP)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.otp_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text NOT NULL,
  purpose      text NOT NULL,
  code_hash    text NOT NULL,
  attempts     smallint NOT NULL DEFAULT 0,
  consumed_at  timestamptz,
  expires_at   timestamptz NOT NULL,
  ip           text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT otp_purpose_chk CHECK (purpose IN ('signup','reset_password','delete_account'))
);
CREATE INDEX IF NOT EXISTS otp_email_purpose_idx ON zhiyu.otp_challenges(email, purpose, created_at DESC);

-- =========================================================
-- pending_deletes (30d soft-delete)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.pending_deletes (
  user_id        uuid PRIMARY KEY REFERENCES zhiyu.profiles(id) ON DELETE CASCADE,
  requested_at   timestamptz NOT NULL DEFAULT now(),
  scheduled_for  timestamptz NOT NULL,
  cancelled_at   timestamptz,
  executed_at    timestamptz
);
CREATE INDEX IF NOT EXISTS pending_deletes_scheduled_idx ON zhiyu.pending_deletes(scheduled_for) WHERE executed_at IS NULL AND cancelled_at IS NULL;

-- =========================================================
-- data_exports (GDPR export jobs)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.data_exports (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES zhiyu.profiles(id) ON DELETE CASCADE,
  status       text NOT NULL DEFAULT 'queued',
  file_path    text,
  download_url text,
  expires_at   timestamptz,
  error        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  CONSTRAINT data_exports_status_chk CHECK (status IN ('queued','running','succeeded','failed','expired'))
);
CREATE INDEX IF NOT EXISTS data_exports_user_idx ON zhiyu.data_exports(user_id, created_at DESC);

-- =========================================================
-- audit_logs (lite)
-- =========================================================
CREATE TABLE IF NOT EXISTS zhiyu.audit_logs (
  id          bigserial PRIMARY KEY,
  ts          timestamptz NOT NULL DEFAULT now(),
  user_id     uuid,
  actor       text,
  action      text NOT NULL,
  target      text,
  ip          text,
  meta        jsonb
);
CREATE INDEX IF NOT EXISTS audit_logs_user_idx ON zhiyu.audit_logs(user_id, ts DESC);
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON zhiyu.audit_logs(action, ts DESC);

-- =========================================================
-- handle_new_user trigger on auth.users (only when auth schema present)
-- =========================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='auth') THEN
    EXECUTE $f$
      CREATE OR REPLACE FUNCTION zhiyu.handle_new_user() RETURNS trigger
      LANGUAGE plpgsql SECURITY DEFINER AS $body$
      DECLARE
        derived_username text;
      BEGIN
        derived_username := 'user_' || substr(replace(NEW.id::text, '-', ''), 1, 8);
        INSERT INTO zhiyu.profiles (id, username, display_name, locale)
        VALUES (
          NEW.id,
          derived_username,
          COALESCE(NEW.raw_user_meta_data->>'display_name', derived_username),
          COALESCE(NEW.raw_user_meta_data->>'locale', 'en')
        )
        ON CONFLICT (id) DO NOTHING;
        INSERT INTO zhiyu.user_settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
        RETURN NEW;
      END
      $body$;
    $f$;
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION zhiyu.handle_new_user();
  END IF;
END$$;

-- =========================================================
-- RLS
-- =========================================================
ALTER TABLE zhiyu.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_devices   ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.pending_deletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.data_exports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.audit_logs     ENABLE ROW LEVEL SECURITY;

-- profiles: public read username/avatar, owner-only write
DROP POLICY IF EXISTS profiles_select ON zhiyu.profiles;
CREATE POLICY profiles_select ON zhiyu.profiles
  FOR SELECT USING (true);
DROP POLICY IF EXISTS profiles_insert_self ON zhiyu.profiles;
CREATE POLICY profiles_insert_self ON zhiyu.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS profiles_update_self ON zhiyu.profiles;
CREATE POLICY profiles_update_self ON zhiyu.profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS profiles_delete_self ON zhiyu.profiles;
CREATE POLICY profiles_delete_self ON zhiyu.profiles
  FOR DELETE USING (auth.uid() = id);

-- user_settings: owner only
DROP POLICY IF EXISTS user_settings_all_self ON zhiyu.user_settings;
CREATE POLICY user_settings_all_self ON zhiyu.user_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- user_devices: owner only
DROP POLICY IF EXISTS user_devices_all_self ON zhiyu.user_devices;
CREATE POLICY user_devices_all_self ON zhiyu.user_devices
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- pending_deletes: owner only
DROP POLICY IF EXISTS pending_deletes_all_self ON zhiyu.pending_deletes;
CREATE POLICY pending_deletes_all_self ON zhiyu.pending_deletes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- data_exports: owner only
DROP POLICY IF EXISTS data_exports_all_self ON zhiyu.data_exports;
CREATE POLICY data_exports_all_self ON zhiyu.data_exports
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- audit_logs: owner read only
DROP POLICY IF EXISTS audit_logs_select_self ON zhiyu.audit_logs;
CREATE POLICY audit_logs_select_self ON zhiyu.audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- service_role bypasses RLS automatically; no extra grants needed.
GRANT USAGE ON SCHEMA zhiyu TO anon, authenticated, service_role;
GRANT SELECT ON zhiyu.profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON zhiyu.profiles TO authenticated;
GRANT ALL ON zhiyu.user_settings TO authenticated;
GRANT ALL ON zhiyu.user_devices TO authenticated;
GRANT ALL ON zhiyu.pending_deletes TO authenticated;
GRANT ALL ON zhiyu.data_exports TO authenticated;
GRANT SELECT ON zhiyu.audit_logs TO authenticated;

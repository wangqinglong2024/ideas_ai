CREATE SCHEMA IF NOT EXISTS zhiyu;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS zhiyu.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  email_verified_at TIMESTAMPTZ,
  display_name TEXT,
  avatar_url TEXT,
  native_lang TEXT NOT NULL CHECK (native_lang IN ('en','vi','th','id')),
  ui_lang TEXT NOT NULL DEFAULT 'en' CHECK (ui_lang IN ('en','vi','th','id')),
  timezone TEXT DEFAULT 'UTC',
  hsk_level_self INT,
  hsk_level_estimated INT,
  persona_tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active','suspended','deleted_pending','deleted')),
  privacy_accepted_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  pinyin_mode TEXT DEFAULT 'tones' CHECK (pinyin_mode IN ('letters','tones','hidden')),
  translation_mode TEXT DEFAULT 'inline' CHECK (translation_mode IN ('inline','collapse','hidden')),
  font_size TEXT DEFAULT 'M' CHECK (font_size IN ('S','M','L','XL')),
  tts_speed DECIMAL(3,2) DEFAULT 1.0,
  tts_voice TEXT DEFAULT 'female_zh',
  email_marketing BOOLEAN DEFAULT TRUE,
  email_learning_reminder BOOLEAN DEFAULT TRUE,
  push_enabled BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light','dark','system')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  user_agent TEXT,
  last_ip TEXT,
  last_country TEXT,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

CREATE TABLE IF NOT EXISTS zhiyu.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  device_id UUID REFERENCES zhiyu.user_devices(id),
  refresh_token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON zhiyu.user_sessions(user_id) WHERE revoked_at IS NULL;

CREATE TABLE IF NOT EXISTS zhiyu.user_email_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('verify_email','reset_password','change_email')),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  attempts INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.user_data_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  file_url TEXT,
  expires_at TIMESTAMPTZ,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS zhiyu.coin_wallets (
  user_id UUID PRIMARY KEY REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  balance INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.coin_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id) ON DELETE CASCADE,
  delta INT NOT NULL,
  reason TEXT NOT NULL,
  source TEXT NOT NULL,
  actor_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  display_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin','editor','reviewer','cs','viewer')),
  languages TEXT[] DEFAULT '{}',
  is_online BOOLEAN DEFAULT FALSE,
  totp_secret TEXT,
  ip_whitelist TEXT[],
  status TEXT DEFAULT 'active',
  failed_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES zhiyu.admin_users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  before JSONB,
  after JSONB,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON zhiyu.admin_audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON zhiyu.admin_audit_logs(resource_type, resource_id, created_at DESC);

CREATE TABLE IF NOT EXISTS zhiyu.feature_flags (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  rollout JSONB,
  updated_by UUID REFERENCES zhiyu.admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.admin_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_translations JSONB,
  body_translations JSONB,
  channel TEXT NOT NULL CHECK (channel IN ('banner','email','push')),
  audience JSONB,
  status TEXT DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES zhiyu.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.content_review_workflow (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'to_review',
  assigned_to UUID REFERENCES zhiyu.admin_users(id),
  language TEXT,
  reviewer_notes TEXT,
  edits JSONB,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_review_assigned ON zhiyu.content_review_workflow(assigned_to, status);

CREATE TABLE IF NOT EXISTS zhiyu.content_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module TEXT NOT NULL CHECK (module IN ('discover','novel')),
  slug TEXT NOT NULL,
  code TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  name_translations JSONB NOT NULL,
  description JSONB,
  cover_image_url TEXT,
  theme_color TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  motif TEXT,
  source_doc TEXT,
  content_boundary TEXT,
  article_count INT NOT NULL DEFAULT 0,
  recent_titles JSONB DEFAULT '[]'::jsonb,
  display_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module, slug)
);

CREATE TABLE IF NOT EXISTS zhiyu.content_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES zhiyu.content_categories(id),
  slug TEXT NOT NULL,
  title_zh TEXT NOT NULL,
  title_translations JSONB NOT NULL,
  summary JSONB,
  cover_image_url TEXT,
  hsk_level INT,
  word_count INT,
  reading_minutes INT,
  length TEXT CHECK (length IN ('short','medium','long')),
  tags TEXT[],
  key_points JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  view_count BIGINT DEFAULT 0,
  rating_avg DECIMAL(3,2),
  rating_count INT DEFAULT 0,
  favorite_count INT DEFAULT 0,
  created_by UUID,
  reviewed_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_articles_published ON zhiyu.content_articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON zhiyu.content_articles(category_id, status);

CREATE TABLE IF NOT EXISTS zhiyu.content_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES zhiyu.content_articles(id) ON DELETE CASCADE,
  lesson_id UUID,
  novel_chapter_id UUID,
  sequence_number INT NOT NULL,
  zh TEXT NOT NULL,
  pinyin TEXT NOT NULL,
  pinyin_tones TEXT,
  translations JSONB NOT NULL,
  audio JSONB,
  hsk_level INT,
  tags TEXT[],
  key_point JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT chk_one_parent CHECK ((article_id IS NOT NULL)::int + (lesson_id IS NOT NULL)::int + (novel_chapter_id IS NOT NULL)::int = 1)
);
CREATE INDEX IF NOT EXISTS idx_sentences_article ON zhiyu.content_sentences(article_id, sequence_number);

CREATE TABLE IF NOT EXISTS zhiyu.learning_reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id),
  target_type TEXT NOT NULL CHECK (target_type IN ('article','novel_chapter')),
  target_id UUID NOT NULL,
  last_sentence_id UUID,
  progress_pct DECIMAL(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  reading_time_seconds INT DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS zhiyu.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS zhiyu.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  content TEXT NOT NULL CHECK (length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.content_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES zhiyu.users(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE TABLE IF NOT EXISTS zhiyu.error_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ DEFAULT NOW(),
  env TEXT,
  service TEXT,
  version TEXT,
  level TEXT,
  fingerprint TEXT,
  count INT DEFAULT 1,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  message TEXT,
  stack TEXT,
  context JSONB
);

CREATE TABLE IF NOT EXISTS zhiyu.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID,
  anon_id TEXT,
  type TEXT NOT NULL,
  props JSONB DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS zhiyu.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT,
  ip TEXT,
  user_agent TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.blocked_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_value TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_by UUID REFERENCES zhiyu.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(entity_type, entity_value)
);

CREATE TABLE IF NOT EXISTS zhiyu.red_line_dictionary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL UNIQUE,
  severity TEXT NOT NULL,
  action TEXT NOT NULL,
  updated_by UUID REFERENCES zhiyu.admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS zhiyu.export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID,
  scope TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('csv','xlsx','json')),
  status TEXT DEFAULT 'queued',
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE zhiyu.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.learning_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE zhiyu.content_ratings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rlsp_self_users ON zhiyu.users;
DROP POLICY IF EXISTS rlsp_self_preferences ON zhiyu.user_preferences;
DROP POLICY IF EXISTS rlsp_self_devices ON zhiyu.user_devices;
DROP POLICY IF EXISTS rlsp_self_sessions ON zhiyu.user_sessions;
DROP POLICY IF EXISTS rlsp_self_reading_progress ON zhiyu.learning_reading_progress;
DROP POLICY IF EXISTS rlsp_self_favorites ON zhiyu.user_favorites;
DROP POLICY IF EXISTS rlsp_self_notes ON zhiyu.user_notes;
DROP POLICY IF EXISTS rlsp_self_ratings ON zhiyu.content_ratings;
CREATE POLICY rlsp_self_users ON zhiyu.users FOR SELECT USING (id = auth.uid());
CREATE POLICY rlsp_self_preferences ON zhiyu.user_preferences USING (user_id = auth.uid());
CREATE POLICY rlsp_self_devices ON zhiyu.user_devices USING (user_id = auth.uid());
CREATE POLICY rlsp_self_sessions ON zhiyu.user_sessions USING (user_id = auth.uid());
CREATE POLICY rlsp_self_reading_progress ON zhiyu.learning_reading_progress USING (user_id = auth.uid());
CREATE POLICY rlsp_self_favorites ON zhiyu.user_favorites USING (user_id = auth.uid());
CREATE POLICY rlsp_self_notes ON zhiyu.user_notes USING (user_id = auth.uid());
CREATE POLICY rlsp_self_ratings ON zhiyu.content_ratings USING (user_id = auth.uid());
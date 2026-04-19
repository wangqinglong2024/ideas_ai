-- T05-003: 证书 Schema
CREATE TABLE user_certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id),
  level_id        UUID NOT NULL REFERENCES levels(id),
  certificate_no  TEXT NOT NULL UNIQUE,
  user_nickname   TEXT NOT NULL,
  level_name_zh   TEXT NOT NULL,
  level_name_en   TEXT NOT NULL,
  level_number    INTEGER NOT NULL,
  hsk_level       TEXT NOT NULL,
  cefr_level      TEXT NOT NULL,
  total_score     DECIMAL(5,2) NOT NULL,
  module_scores   JSONB,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  certificate_type TEXT NOT NULL DEFAULT 'level',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_certificates_user_level ON user_certificates(user_id, level_id, certificate_type)
  WHERE is_active = true;
CREATE INDEX idx_certificates_user ON user_certificates(user_id);
CREATE INDEX idx_certificates_level ON user_certificates(level_id);
CREATE INDEX idx_certificates_no ON user_certificates(certificate_no);
CREATE INDEX idx_certificates_issued ON user_certificates(issued_at DESC);

-- 证书编号生成函数
CREATE OR REPLACE FUNCTION generate_certificate_no(p_level_number INTEGER)
RETURNS TEXT
LANGUAGE plpgsql AS $$
DECLARE
  v_date TEXT;
  v_random TEXT;
  v_no TEXT;
  v_exists BOOLEAN;
BEGIN
  v_date := TO_CHAR(now(), 'YYYYMMDD');
  LOOP
    v_random := UPPER(SUBSTRING(md5(random()::text) FROM 1 FOR 4));
    v_no := 'ZY-L' || LPAD(p_level_number::TEXT, 2, '0') || '-' || v_date || '-' || v_random;
    SELECT EXISTS(SELECT 1 FROM user_certificates WHERE certificate_no = v_no) INTO v_exists;
    IF NOT v_exists THEN
      RETURN v_no;
    END IF;
  END LOOP;
END;
$$;

-- RLS
ALTER TABLE user_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_user_read" ON user_certificates
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

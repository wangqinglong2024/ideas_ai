// 发现中国（Discover China）Zod schema
// 来源：function/01-china/ai/F1-AI-数据模型规范/07-校验规则汇总.md
// 校验规则与 0005_china_module.sql 中的 CHECK / CHECK 约束一一对应。

import { z } from 'zod';

// -------------------------------------------------------------------------
// 公共：5 语言 locale + i18n 字典工厂
// -------------------------------------------------------------------------
export const CHINA_LOCALES = ['zh', 'en', 'vi', 'th', 'id'] as const;
export type ChinaLocale = (typeof CHINA_LOCALES)[number];

const i18nString = (max: number) =>
  z.object({
    zh: z.string().min(1).max(max),
    en: z.string().min(1).max(max),
    vi: z.string().min(1).max(max),
    th: z.string().min(1).max(max),
    id: z.string().min(1).max(max),
  });

export const ChinaI18nName40 = i18nString(40);
export const ChinaI18nDesc200 = i18nString(200);

// -------------------------------------------------------------------------
// 编号正则
// -------------------------------------------------------------------------
export const CHINA_CATEGORY_CODE_RE = /^(0[1-9]|1[0-2])$/;
export const CHINA_ARTICLE_CODE_RE = /^[A-Z0-9]{12}$/;

// -------------------------------------------------------------------------
// china_categories
// -------------------------------------------------------------------------
export const ChinaCategoryRow = z.object({
  id: z.string().uuid(),
  code: z.string().regex(CHINA_CATEGORY_CODE_RE),
  name_i18n: ChinaI18nName40,
  description_i18n: ChinaI18nDesc200,
  sort_order: z.number().int().min(1).max(12),
  created_at: z.string(),
  updated_at: z.string(),
});
export type ChinaCategoryRow = z.infer<typeof ChinaCategoryRow>;

// -------------------------------------------------------------------------
// china_articles
// -------------------------------------------------------------------------
export const ChinaArticleStatus = z.enum(['draft', 'published']);
export type ChinaArticleStatus = z.infer<typeof ChinaArticleStatus>;

export const ChinaArticleRow = z.object({
  id: z.string().uuid(),
  code: z.string().regex(CHINA_ARTICLE_CODE_RE),
  category_id: z.string().uuid(),
  title_pinyin: z.string().min(1).max(200),
  title_i18n: ChinaI18nName40,
  status: ChinaArticleStatus,
  published_at: z.string().nullable(),
  created_by: z.string().uuid().nullable(),
  updated_by: z.string().uuid().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});
export type ChinaArticleRow = z.infer<typeof ChinaArticleRow>;

// 创建 / 更新输入（管理端）
export const ChinaArticleUpsertInput = z.object({
  category_id: z.string().uuid(),
  title_pinyin: z.string().min(1).max(200),
  title_i18n: ChinaI18nName40,
});
export type ChinaArticleUpsertInput = z.infer<typeof ChinaArticleUpsertInput>;

// -------------------------------------------------------------------------
// china_sentences
// -------------------------------------------------------------------------
export const ChinaSentenceAudioStatus = z.enum([
  'pending',
  'processing',
  'ready',
  'failed',
]);
export type ChinaSentenceAudioStatus = z.infer<typeof ChinaSentenceAudioStatus>;

export const ChinaSentenceRow = z.object({
  id: z.string().uuid(),
  article_id: z.string().uuid(),
  seq_no: z.number().int().min(1).max(9999),
  pinyin: z.string().min(1).max(600),
  content_zh: z.string().min(1).max(400),
  content_en: z.string().min(1).max(400),
  content_vi: z.string().min(1).max(400),
  content_th: z.string().min(1).max(400),
  content_id: z.string().min(1).max(400),
  audio_url_zh: z.string().nullable(),
  audio_status: ChinaSentenceAudioStatus,
  audio_provider: z.string().nullable(),
  audio_voice: z.string().nullable(),
  audio_duration_ms: z.number().int().nullable(),
  audio_generated_at: z.string().nullable(),
  audio_error: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});
export type ChinaSentenceRow = z.infer<typeof ChinaSentenceRow>;

export const ChinaSentenceUpsertInput = z.object({
  pinyin: z.string().min(1).max(600),
  content_zh: z.string().min(1).max(400),
  content_en: z.string().min(1).max(400),
  content_vi: z.string().min(1).max(400),
  content_th: z.string().min(1).max(400),
  content_id: z.string().min(1).max(400),
});
export type ChinaSentenceUpsertInput = z.infer<typeof ChinaSentenceUpsertInput>;

// -------------------------------------------------------------------------
// 业务错误码（与 RPC raise exception 字符串一一对应）
// -------------------------------------------------------------------------
export const ChinaErrorCode = {
  CATEGORY_CODE_INVALID: 'CHINA_CATEGORY_CODE_INVALID',
  CATEGORY_NAME_I18N_MISSING: 'CHINA_CATEGORY_NAME_I18N_MISSING',
  CATEGORY_NAME_TOO_LONG: 'CHINA_CATEGORY_NAME_TOO_LONG',
  CATEGORY_DESC_I18N_MISSING: 'CHINA_CATEGORY_DESC_I18N_MISSING',
  CATEGORY_DESC_TOO_LONG: 'CHINA_CATEGORY_DESC_TOO_LONG',

  ARTICLE_NOT_FOUND: 'CHINA_ARTICLE_NOT_FOUND',
  ARTICLE_CODE_INVALID: 'CHINA_ARTICLE_CODE_INVALID',
  ARTICLE_CODE_DUPLICATE: 'CHINA_ARTICLE_CODE_DUPLICATE',
  ARTICLE_CODE_GEN_FAILED: 'CHINA_ARTICLE_CODE_GEN_FAILED',
  ARTICLE_CATEGORY_REQUIRED: 'CHINA_ARTICLE_CATEGORY_REQUIRED',
  ARTICLE_CATEGORY_NOT_FOUND: 'CHINA_ARTICLE_CATEGORY_NOT_FOUND',
  ARTICLE_TITLE_PINYIN_LEN: 'CHINA_ARTICLE_TITLE_PINYIN_LEN',
  ARTICLE_TITLE_I18N_MISSING: 'CHINA_ARTICLE_TITLE_I18N_MISSING',
  ARTICLE_TITLE_TOO_LONG: 'CHINA_ARTICLE_TITLE_TOO_LONG',
  ARTICLE_STATUS_INVALID: 'CHINA_ARTICLE_STATUS_INVALID',
  ARTICLE_PUBLISH_NO_SENTENCES: 'CHINA_ARTICLE_PUBLISH_NO_SENTENCES',
  ARTICLE_ALREADY_PUBLISHED: 'CHINA_ARTICLE_ALREADY_PUBLISHED',
  ARTICLE_ALREADY_DRAFT: 'CHINA_ARTICLE_ALREADY_DRAFT',

  SENTENCE_ARTICLE_NOT_FOUND: 'CHINA_SENTENCE_ARTICLE_NOT_FOUND',
  SENTENCE_SEQ_RANGE: 'CHINA_SENTENCE_SEQ_RANGE',
  SENTENCE_SEQ_DUPLICATE: 'CHINA_SENTENCE_SEQ_DUPLICATE',
  SENTENCE_SEQ_OVERFLOW: 'CHINA_SENTENCE_SEQ_OVERFLOW',
  SENTENCE_PINYIN_LEN: 'CHINA_SENTENCE_PINYIN_LEN',
  SENTENCE_CONTENT_ZH_LEN: 'CHINA_SENTENCE_CONTENT_ZH_LEN',
  SENTENCE_CONTENT_EN_LEN: 'CHINA_SENTENCE_CONTENT_EN_LEN',
  SENTENCE_CONTENT_VI_LEN: 'CHINA_SENTENCE_CONTENT_VI_LEN',
  SENTENCE_CONTENT_TH_LEN: 'CHINA_SENTENCE_CONTENT_TH_LEN',
  SENTENCE_CONTENT_ID_LEN: 'CHINA_SENTENCE_CONTENT_ID_LEN',
  SENTENCE_AUDIO_STATUS_INVALID: 'CHINA_SENTENCE_AUDIO_STATUS_INVALID',
  SENTENCE_AUDIO_URL_REQUIRED: 'CHINA_SENTENCE_AUDIO_URL_REQUIRED',
} as const;

export type ChinaErrorCode = (typeof ChinaErrorCode)[keyof typeof ChinaErrorCode];

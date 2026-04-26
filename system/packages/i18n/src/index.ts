/** Placeholder i18n package. Real translations land in E04. */
export const SUPPORTED_LOCALES = ['zh-CN', 'en', 'ja', 'ko'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

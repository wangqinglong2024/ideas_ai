export type Locale = 'zh-CN' | 'vi-VN' | 'th-TH' | 'id-ID' | 'en-US';

const messages: Record<Locale, Record<string, string>> = {
  'zh-CN': { welcome: '欢迎来到知语' },
  'vi-VN': { welcome: 'Chao mung den Zhiyu' },
  'th-TH': { welcome: 'Yin dee ton rap su Zhiyu' },
  'id-ID': { welcome: 'Selamat datang di Zhiyu' },
  'en-US': { welcome: 'Welcome to Zhiyu' },
};

export function translate(locale: Locale, key: string): string {
  return messages[locale][key] ?? messages['en-US'][key] ?? key;
}

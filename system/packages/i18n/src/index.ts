import type { Locale } from '@zhiyu/types';

export type { Locale } from '@zhiyu/types';

export const locales: Locale[] = ['en', 'vi', 'th', 'id'];

export const messages: Record<Locale, Record<string, string>> = {
  en: { discover: 'Discover', courses: 'Courses', games: 'Games', profile: 'Profile', login: 'Login', register: 'Register', settings: 'Settings', dashboard: 'Dashboard', audit: 'Audit', search: 'Search', language: 'Language', pinyinMode: 'Pinyin mode', translationMode: 'Translation display', fontSize: 'Font size', ttsSpeed: 'TTS speed', unlockDiscover: 'Register free to unlock all Discover China' },
  vi: { discover: 'Khám phá', courses: 'Khóa học', games: 'Trò chơi', profile: 'Cá nhân', login: 'Đăng nhập', register: 'Đăng ký', settings: 'Cài đặt', dashboard: 'Bảng điều khiển', audit: 'Kiểm toán', search: 'Tìm kiếm', language: 'Ngôn ngữ', pinyinMode: 'Chế độ pinyin', translationMode: 'Hiển thị bản dịch', fontSize: 'Cỡ chữ', ttsSpeed: 'Tốc độ đọc', unlockDiscover: 'Đăng ký miễn phí để mở toàn bộ Discover China' },
  th: { discover: 'ค้นพบ', courses: 'คอร์ส', games: 'เกม', profile: 'โปรไฟล์', login: 'เข้าสู่ระบบ', register: 'สมัคร', settings: 'ตั้งค่า', dashboard: 'แดชบอร์ด', audit: 'บันทึกตรวจสอบ', search: 'ค้นหา', language: 'ภาษา', pinyinMode: 'โหมดพินอิน', translationMode: 'การแสดงคำแปล', fontSize: 'ขนาดตัวอักษร', ttsSpeed: 'ความเร็วเสียง', unlockDiscover: 'สมัครฟรีเพื่อปลดล็อก Discover China ทั้งหมด' },
  id: { discover: 'Jelajah', courses: 'Kursus', games: 'Game', profile: 'Profil', login: 'Masuk', register: 'Daftar', settings: 'Pengaturan', dashboard: 'Dasbor', audit: 'Audit', search: 'Cari', language: 'Bahasa', pinyinMode: 'Mode pinyin', translationMode: 'Tampilan terjemahan', fontSize: 'Ukuran huruf', ttsSpeed: 'Kecepatan TTS', unlockDiscover: 'Daftar gratis untuk membuka semua Discover China' }
};

export function normalizeLocale(value?: string): Locale {
  return locales.includes(value as Locale) ? value as Locale : 'en';
}

export function t(locale: Locale, key: string) {
  return messages[locale][key] ?? messages.en[key] ?? key;
}

export function localeFromPath(pathname: string): Locale {
  const first = pathname.split('/').filter(Boolean)[0];
  return normalizeLocale(first);
}

export function stripLocale(pathname: string) {
  const parts = pathname.split('/').filter(Boolean);
  if (locales.includes(parts[0] as Locale)) parts.shift();
  return `/${parts.join('/')}`;
}

export function localizedText(value: Partial<Record<Locale, string>> | undefined, locale: Locale, fallback = '') {
  return value?.[locale] ?? value?.en ?? fallback;
}
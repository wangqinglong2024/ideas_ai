import type { Locale } from '@zhiyu/types';

export type { Locale } from '@zhiyu/types';

export const locales: Locale[] = ['en', 'vi', 'th', 'id'];

export const messages: Record<Locale, Record<string, string>> = {
  en: { discover: 'Discover', courses: 'Courses', games: 'Games', profile: 'Profile', login: 'Login', register: 'Register', settings: 'Settings', dashboard: 'Dashboard', audit: 'Audit' },
  vi: { discover: 'Khám phá', courses: 'Khóa học', games: 'Trò chơi', profile: 'Cá nhân', login: 'Đăng nhập', register: 'Đăng ký', settings: 'Cài đặt', dashboard: 'Bảng điều khiển', audit: 'Kiểm toán' },
  th: { discover: 'ค้นพบ', courses: 'คอร์ส', games: 'เกม', profile: 'โปรไฟล์', login: 'เข้าสู่ระบบ', register: 'สมัคร', settings: 'ตั้งค่า', dashboard: 'แดชบอร์ด', audit: 'บันทึกตรวจสอบ' },
  id: { discover: 'Jelajah', courses: 'Kursus', games: 'Game', profile: 'Profil', login: 'Masuk', register: 'Daftar', settings: 'Pengaturan', dashboard: 'Dasbor', audit: 'Audit' }
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
export type ApiError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResponse<T> = {
  data: T | null;
  meta: Record<string, unknown> | null;
  error: ApiError | null;
};

export type Locale = 'en' | 'vi' | 'th' | 'id';
export type ThemeMode = 'light' | 'dark' | 'system';
export type AdminRole = 'admin' | 'editor' | 'reviewer' | 'cs' | 'viewer';

export type UserProfile = {
  id: string;
  email: string;
  emailVerifiedAt?: string | null;
  displayName: string;
  avatarUrl?: string | null;
  nativeLang: Locale;
  uiLang: Locale;
  timezone: string;
  hskLevelSelf?: number | null;
  hskLevelEstimated?: number | null;
  personaTags: string[];
  status: 'active' | 'suspended' | 'deleted_pending' | 'deleted';
  coins: number;
  createdAt: string;
};

export type UserPreferences = {
  pinyinMode: 'letters' | 'tones' | 'hidden';
  translationMode: 'inline' | 'collapse' | 'hidden';
  fontSize: 'S' | 'M' | 'L' | 'XL';
  ttsSpeed: 0.5 | 0.75 | 1 | 1.25 | 1.5;
  ttsVoice: 'male_zh' | 'female_zh' | 'child_zh';
  emailMarketing: boolean;
  emailLearningReminder: boolean;
  pushEnabled: boolean;
  theme: ThemeMode;
};

export type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  languages: Locale[];
  isOnline: boolean;
  status: 'active' | 'locked' | 'disabled';
  lastLoginAt?: string | null;
};

export type AuditLog = {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string;
  userAgent: string;
  createdAt: string;
};
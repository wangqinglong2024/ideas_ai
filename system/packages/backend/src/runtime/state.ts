import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import type { AdminRole, AuditLog, UserPreferences, UserProfile } from '@zhiyu/types';

const now = () => new Date().toISOString();
const passwordHash = bcrypt.hashSync('Password123!', 12);

export type SessionRecord = { id: string; userId: string; deviceName: string; ip: string; lastActiveAt: string; revokedAt?: string | null };
export type OtpRecord = { userId: string; email: string; code: string; purpose: string; expiresAt: number; attempts: number; consumedAt?: string };
export type OrderRecord = { id: string; userId: string; status: string; amountUsd: number; plan: string; createdAt: string; webhookHistory: string[] };
export type AdminRecord = { id: string; email: string; passwordHash: string; displayName: string; role: AdminRole; languages: string[]; isOnline: boolean; status: string; failedAttempts: number; lockedUntil: string | null; lastLoginAt: string | null };

const defaultPreferences: UserPreferences = {
  pinyinMode: 'tones',
  translationMode: 'inline',
  fontSize: 'M',
  ttsSpeed: 1,
  ttsVoice: 'female_zh',
  emailMarketing: true,
  emailLearningReminder: true,
  pushEnabled: false,
  theme: 'system'
};

function makeUser(email: string, displayName: string, status: UserProfile['status'], coins: number): UserProfile & { passwordHash: string } {
  return {
    id: randomUUID(),
    email,
    passwordHash,
    emailVerifiedAt: email === 'blocked@example.com' ? null : now(),
    displayName,
    avatarUrl: null,
    nativeLang: 'en',
    uiLang: 'en',
    timezone: 'UTC',
    hskLevelSelf: 1,
    hskLevelEstimated: 1,
    personaTags: ['hsk_student'],
    status,
    coins,
    createdAt: now()
  };
}

const users = [
  makeUser('normal@example.com', 'Normal Learner', 'active', 100),
  makeUser('vip@example.com', 'VIP Learner', 'active', 800),
  makeUser('referrer@example.com', 'Referral Partner', 'active', 500),
  makeUser('blocked@example.com', 'Blocked Learner', 'suspended', 0)
];

const adminUsers: AdminRecord[] = [
  { id: randomUUID(), email: 'admin@example.com', passwordHash, displayName: 'Admin', role: 'admin' as AdminRole, languages: ['en', 'vi'], isOnline: false, status: 'active', failedAttempts: 0, lockedUntil: null, lastLoginAt: null },
  { id: randomUUID(), email: 'editor@example.com', passwordHash, displayName: 'Editor', role: 'editor' as AdminRole, languages: ['en'], isOnline: false, status: 'active', failedAttempts: 0, lockedUntil: null, lastLoginAt: null },
  { id: randomUUID(), email: 'reviewer@example.com', passwordHash, displayName: 'Reviewer', role: 'reviewer' as AdminRole, languages: ['en', 'vi', 'th'], isOnline: false, status: 'active', failedAttempts: 0, lockedUntil: null, lastLoginAt: null },
  { id: randomUUID(), email: 'cs@example.com', passwordHash, displayName: 'Customer Support', role: 'cs' as AdminRole, languages: ['en', 'vi', 'th', 'id'], isOnline: false, status: 'active', failedAttempts: 0, lockedUntil: null, lastLoginAt: null },
  { id: randomUUID(), email: 'viewer@example.com', passwordHash, displayName: 'Viewer', role: 'viewer' as AdminRole, languages: ['en'], isOnline: false, status: 'active', failedAttempts: 0, lockedUntil: null, lastLoginAt: null }
];

const categories = [
  ['history', '中国历史', '碑拓线条与松烟墨'], ['cuisine', '中国美食', '温瓷与蒸汽曲线'], ['scenic', '名胜风光', '山水留白'],
  ['festivals', '传统节日', '节气纹理'], ['arts', '艺术非遗', '宣纸笔触'], ['music-opera', '音乐戏曲', '弦线声波'],
  ['literature', '文学经典', '书页节奏'], ['idioms', '成语典故', '印章短签'], ['philosophy', '哲学思想', '圆相竹简'],
  ['modern', '当代中国', '城市线稿'], ['fun-hanzi', '趣味汉字', '字形演变'], ['myths', '中国神话传说', '云水星图']
].map(([slug, title, motif], index) => ({ slug, title, motif, public: index < 3, count: 3 }));

const articles = categories.flatMap((category, categoryIndex) => Array.from({ length: 3 }, (_, articleIndex) => ({
  id: randomUUID(),
  slug: `${category.slug}-article-${articleIndex + 1}`,
  category: category.slug,
  title: `${category.title} ${articleIndex + 1}`,
  hskLevel: (articleIndex % 3) + 1,
  estimatedMinutes: 5 + articleIndex,
  public: category.public,
  sentences: [
    { zh: '知语用清晰的句子讲述中国文化。', pinyin: 'zhi1 yu3 yong4 qing1 xi1 de ju4 zi jiang3 shu4 zhong1 guo2 wen2 hua4', translation: 'Zhiyu explains Chinese culture with clear sentences.' },
    { zh: `这一篇来自${category.title}类目。`, pinyin: 'zhe4 yi1 pian1 lai2 zi4 lei4 mu4', translation: `This article belongs to ${category.title}.` }
  ],
  createdAt: now(),
  order: categoryIndex * 10 + articleIndex
})));

export const state = {
  users,
  preferences: new Map(users.map((user) => [user.id, { ...defaultPreferences }])),
  sessions: [] as SessionRecord[],
  otps: [] as OtpRecord[],
  adminUsers,
  audits: [] as AuditLog[],
  categories,
  articles,
  events: [] as Record<string, unknown>[],
  errorEvents: [] as Record<string, unknown>[],
  orders: users.slice(0, 2).map((user, index): OrderRecord => ({ id: randomUUID(), userId: user.id, status: index === 0 ? 'paid' : 'refund_pending', amountUsd: index === 0 ? 4 : 12, plan: index === 0 ? 'monthly' : 'half-year-launch', createdAt: now(), webhookHistory: ['dummy.checkout.completed'] })),
  featureFlags: [
    { key: 'payment.provider', value: { provider: 'dummy' }, description: 'PaymentAdapter dummy provider', rollout: { strategy: 'all' } },
    { key: 'promo.banner', value: { enabled: true }, description: 'Multi-language promo banner', rollout: { countries: ['VN', 'TH', 'ID'] } },
    { key: 'game.live', value: { enabled: true }, description: '12 MVP games visible', rollout: { percent: 100 } }
  ],
  reviewQueue: [{ id: randomUUID(), resourceType: 'article', resourceId: randomUUID(), status: 'to_review', language: 'vi', title: '中国历史 1', notes: '', edits: {} }],
  exports: [] as Record<string, unknown>[],
  announcements: [] as Record<string, unknown>[],
  securityEvents: [{ id: randomUUID(), severity: 'warning', type: 'rate_limit', subject: 'login', ip: '127.0.0.1', createdAt: now() }],
  blockedEntities: [] as Record<string, unknown>[],
  redLineRules: [{ id: randomUUID(), term: 'forbidden-demo', severity: 'high', action: 'block' }]
};

export function audit(input: Omit<AuditLog, 'id' | 'createdAt'>) {
  const log: AuditLog = { ...input, id: randomUUID(), createdAt: now() };
  state.audits.unshift(log);
  return log;
}

export function publicUser(user: UserProfile & { passwordHash?: string }) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

export { defaultPreferences, now, passwordHash };
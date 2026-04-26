/**
 * Auth helpers used by routes: OTP issue/verify, password policy, lockout.
 * No real email is sent — uses EmailAdapter from the bundle.
 */
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

export const PASSWORD_POLICY = {
  minLength: 10,
  description: '至少 10 位，包含大写字母、数字、特殊字符',
};

export function validatePassword(pw: string): { ok: boolean; reason?: string } {
  if (typeof pw !== 'string' || pw.length < PASSWORD_POLICY.minLength) {
    return { ok: false, reason: 'password_too_short' };
  }
  if (!/[A-Z]/.test(pw)) return { ok: false, reason: 'password_needs_upper' };
  if (!/[0-9]/.test(pw)) return { ok: false, reason: 'password_needs_digit' };
  if (!/[^A-Za-z0-9]/.test(pw)) return { ok: false, reason: 'password_needs_symbol' };
  return { ok: true };
}

export function generateOtp(length = 6): string {
  const max = 10 ** length;
  return String(randomInt(0, max)).padStart(length, '0');
}

export function hashOtp(code: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${code}`).digest('hex');
}

export function verifyOtp(code: string, hash: string, salt: string): boolean {
  const candidate = Buffer.from(hashOtp(code, salt), 'hex');
  const target = Buffer.from(hash, 'hex');
  if (candidate.length !== target.length) return false;
  return timingSafeEqual(candidate, target);
}

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 min
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60s per email
export const OTP_IP_WINDOW_MS = 5 * 60 * 1000;
export const OTP_IP_MAX = 5;
export const OTP_MAX_ATTEMPTS = 5;

export const LOGIN_LOCK_THRESHOLD = 5;
export const LOGIN_LOCK_WINDOW_MS = 15 * 60 * 1000;

// 邮箱验证码（OTP）· dev mock 实现
// - 内存存储（进程级）；HMR 重启会清空，符合开发体验
// - 5 分钟有效；同一 (email, purpose) 后发覆盖前发
// - 同时落 console.log 与 /tmp/zhiyu-otp.log，便于本地查阅
import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { Env } from '../env.ts';

type Purpose = 'register' | 'reset_password';
type Entry = { code: string; expires_at: number };

const store = new Map<string, Entry>();
const TTL_MS = 5 * 60 * 1000;
const LOG_FILE = path.resolve('/tmp/zhiyu-otp.log');

function key(email: string, purpose: Purpose): string {
  return `${purpose}:${email.toLowerCase()}`;
}

function gen6(): string {
  // 使用加密随机源，避免可预测
  const buf = new Uint8Array(4);
  globalThis.crypto.getRandomValues(buf);
  const n = (buf[0]! << 24 | buf[1]! << 16 | buf[2]! << 8 | buf[3]!) >>> 0;
  return String(n % 1_000_000).padStart(6, '0');
}

export async function sendEmailOtp(email: string, purpose: Purpose, _env: Env): Promise<string> {
  const code = gen6();
  store.set(key(email, purpose), { code, expires_at: Date.now() + TTL_MS });
  const line = `[${new Date().toISOString()}] OTP send purpose=${purpose} email=${email} code=${code}\n`;
  // 同步双写：console + 本地日志文件
  // eslint-disable-next-line no-console
  console.log(line.trim());
  try { await fs.appendFile(LOG_FILE, line, 'utf8'); } catch { /* ignore */ }
  return code;
}

export async function consumeEmailOtp(email: string, code: string, purpose: Purpose): Promise<boolean> {
  const k = key(email, purpose);
  const ent = store.get(k);
  if (!ent) return false;
  if (Date.now() > ent.expires_at) {
    store.delete(k);
    return false;
  }
  if (ent.code !== code) return false;
  store.delete(k); // 一次性
  return true;
}

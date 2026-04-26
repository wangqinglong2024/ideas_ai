const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export type ApiError = { error: string; issues?: unknown; detail?: string; retry_after_seconds?: number; retry_after_days?: number };

const camelToSnake = (s: string): string => s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);

function normalize<T = unknown>(value: unknown): T {
  if (Array.isArray(value)) return value.map((v) => normalize(v)) as unknown as T;
  if (value && typeof value === 'object' && value.constructor === Object) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[camelToSnake(k)] = normalize(v);
    }
    return out as T;
  }
  return value as T;
}

export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const err = (body && typeof body === 'object' ? (body as ApiError) : { error: 'http_error' }) as ApiError;
    throw Object.assign(new Error(err.error ?? 'http_error'), { status: res.status, body: err });
  }
  return normalize<T>(body);
}

export const auth = {
  signUp: (email: string) => api<{ challenge_id: string; dev_code?: string }>('/api/v1/auth/sign-up', { method: 'POST', body: JSON.stringify({ email }) }),
  verifyOtp: (payload: { challenge_id: string; code: string; password?: string; display_name?: string; locale?: string }) =>
    api<{ user: { id: string; email: string }; access_token: string }>('/api/v1/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
  signIn: (email: string, password: string) =>
    api<{ user: { id: string; email: string }; access_token: string }>('/api/v1/auth/sign-in', { method: 'POST', body: JSON.stringify({ email, password }) }),
  signOut: () => api<{ ok: boolean }>('/api/v1/auth/sign-out', { method: 'POST' }),
  me: () => api<{ user: { id: string; email: string | null } }>('/api/v1/auth/me'),
  providers: () => api<{ providers: { google: boolean; apple: boolean } }>('/api/v1/auth/providers'),
  resetRequest: (email: string) =>
    api<{ challenge_id: string; dev_code?: string }>('/api/v1/auth/reset-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetConfirm: (payload: { challenge_id: string; code: string; new_password: string }) =>
    api<{ ok: boolean }>('/api/v1/auth/reset-password/confirm', { method: 'POST', body: JSON.stringify(payload) }),
};

export const me = {
  get: () => api<{ profile: Record<string, unknown>; settings: Record<string, unknown> | null; email: string | null }>('/api/v1/me'),
  patch: (patch: Record<string, unknown>) => api<{ ok: boolean }>('/api/v1/me', { method: 'PATCH', body: JSON.stringify(patch) }),
  settingsGet: () => api<Record<string, unknown>>('/api/v1/me/settings'),
  settingsPatch: (patch: Record<string, unknown>) => api<{ ok: boolean }>('/api/v1/me/settings', { method: 'PATCH', body: JSON.stringify(patch) }),
  signAvatar: (filename: string, contentType: string) =>
    api<{ upload_url: string; token: string; path: string; public_url: string; fake?: boolean }>(
      '/api/v1/me/avatar/sign',
      { method: 'POST', body: JSON.stringify({ filename, content_type: contentType }) },
    ),
  sessions: () => api<{ sessions: Array<{ id: string; current: boolean; user_agent: string | null; ip: string; last_seen_at: string }> }>('/api/v1/me/sessions'),
  revokeAll: (keepCurrent: boolean) => api<{ ok: boolean }>(`/api/v1/me/sessions?keepCurrent=${keepCurrent}`, { method: 'DELETE' }),
  revokeOne: (id: string) => api<{ ok: boolean }>(`/api/v1/me/sessions/${id}`, { method: 'DELETE' }),
  exportEnqueue: () => api<{ id: string; status: string }>('/api/v1/me/export', { method: 'POST' }),
  exportList: () => api<{ exports: Array<{ id: string; status: string; download_url: string | null; created_at: string; completed_at: string | null }> }>('/api/v1/me/exports'),
  deleteAccount: (password?: string) => api<{ ok: boolean; scheduled_for: string }>('/api/v1/me/delete', { method: 'POST', body: JSON.stringify({ confirm: 'DELETE_MY_ACCOUNT', password }) }),
  deleteCancel: () => api<{ ok: boolean }>('/api/v1/me/delete/cancel', { method: 'POST' }),
  deleteStatus: () => api<{ pending: boolean; scheduled_for?: string; cancelled_at?: string | null; executed_at?: string | null }>('/api/v1/me/delete/status'),
};

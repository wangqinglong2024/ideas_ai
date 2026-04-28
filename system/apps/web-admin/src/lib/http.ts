const ADMIN_API = (import.meta.env.VITE_API_BASE_ADMIN as string) || 'http://localhost:9100/admin/v1';

export class AdminApiError extends Error {
  code: number;
  status: number;
  details?: unknown;
  constructor(message: string, code: number, status: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export async function adminApi<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(ADMIN_API + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
    credentials: 'include',
  });
  let json: { code?: number; data?: T; message?: string; details?: unknown } = {};
  try { json = (await res.json()) as never; } catch { /* noop */ }
  if (!res.ok || (typeof json.code === 'number' && json.code !== 0)) {
    throw new AdminApiError(json.message || `http_${res.status}`, json.code ?? res.status, res.status, json.details);
  }
  return (json.data as T) ?? (undefined as never);
}

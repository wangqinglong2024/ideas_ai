export function apiBase() {
  const configured = import.meta.env.VITE_API_BASE as string | undefined;
  if (configured) return configured;
  return `${window.location.protocol}//${window.location.hostname}:9100`;
}

export function adminToken() {
  return localStorage.getItem('zy.admin.token');
}

export async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<{ data: T | null; error: { message: string } | null; meta?: Record<string, unknown> | null }> {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  const token = adminToken();
  if (token) headers.set('authorization', `Bearer ${token}`);
  const response = await fetch(`${apiBase()}${path}`, { ...init, headers, credentials: 'include' });
  return response.json();
}
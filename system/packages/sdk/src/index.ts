import type { ApiResponse } from '@zhiyu/types';

export type ClientOptions = { baseURL: string; getToken?: () => string | null; onUnauthorized?: () => void };

export function createClient(options: ClientOptions) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = options.getToken?.();
    const headers = new Headers(init.headers);
    headers.set('content-type', 'application/json');
    if (token) headers.set('authorization', `Bearer ${token}`);
    const response = await fetch(`${options.baseURL}${path}`, { ...init, headers, credentials: 'include' });
    if (response.status === 401) options.onUnauthorized?.();
    return response.json() as Promise<ApiResponse<T>>;
  }

  return {
    request,
    auth: {
      register: (body: Record<string, unknown>) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
      login: (body: Record<string, unknown>) => request<{ accessToken: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) })
    },
    me: {
      get: () => request('/api/me'),
      patch: (body: Record<string, unknown>) => request('/api/me', { method: 'PATCH', body: JSON.stringify(body) }),
      preferences: (body: Record<string, unknown>) => request('/api/me/preferences', { method: 'PATCH', body: JSON.stringify(body) })
    },
    telemetry: {
      event: (type: string, props: Record<string, unknown>) => request('/api/v1/_telemetry/events', { method: 'POST', body: JSON.stringify({ type, props }) }),
      error: (payload: Record<string, unknown>) => request('/api/v1/_telemetry/error', { method: 'POST', body: JSON.stringify(payload) })
    }
  };
}
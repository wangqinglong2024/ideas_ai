import { createClient } from '@zhiyu/sdk';

export function apiBase() {
  const configured = import.meta.env.VITE_API_BASE as string | undefined;
  if (configured) return configured;
  return `${window.location.protocol}//${window.location.hostname}:8100`;
}

export function token() {
  return localStorage.getItem('zy.token');
}

export const api = createClient({ baseURL: apiBase(), getToken: token, onUnauthorized: () => localStorage.removeItem('zy.token') });

export async function getJson<T>(path: string): Promise<T | null> {
  const headers = new Headers();
  const currentToken = token();
  if (currentToken) headers.set('authorization', `Bearer ${currentToken}`);
  const response = await fetch(`${apiBase()}${path}`, { headers, credentials: 'include' });
  const json = await response.json();
  if (!response.ok) return null;
  return json.data as T;
}
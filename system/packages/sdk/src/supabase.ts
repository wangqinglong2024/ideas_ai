/**
 * Thin wrappers around @supabase/supabase-js for server and browser use.
 *
 * - `createServerClient`  → uses SERVICE_ROLE_KEY, bypasses RLS, server-only.
 * - `createAnonClient`    → uses ANON_KEY, suitable for SSR or admin APIs that act on behalf of users.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface ServerClientOptions {
  url: string;
  serviceRoleKey: string;
}

export function createServerClient(opts: ServerClientOptions): SupabaseClient {
  return createClient(opts.url, opts.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'zhiyu-server' } },
  });
}

export interface AnonClientOptions {
  url: string;
  anonKey: string;
}

export function createAnonClient(opts: AnonClientOptions): SupabaseClient {
  return createClient(opts.url, opts.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

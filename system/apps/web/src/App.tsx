import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export default function App(): JSX.Element {
  const [path, setPath] = useState<string>(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (path === '/_debug/supabase') return <DebugSupabase />;
  if (path === '/_debug/throw') return <DebugThrow />;
  return <Home />;
}

function Home(): JSX.Element {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32, maxWidth: 720 }}>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Hello Zhiyu</h1>
      <p style={{ color: '#555' }}>知语 · 中文学习平台 (dev placeholder)</p>
      <ul>
        <li>
          <a href="/_debug/supabase" data-testid="link-supabase">/_debug/supabase</a>
        </li>
        <li>
          <a href="/_debug/throw" data-testid="link-throw">/_debug/throw (raises error)</a>
        </li>
        <li>API base: <code>{API_BASE || '(unset)'}</code></li>
        <li>Supabase URL: <code>{SUPABASE_URL || '(unset)'}</code></li>
      </ul>
    </main>
  );
}

function DebugSupabase(): JSX.Element {
  const [state, setState] = useState<{ loading: boolean; rows?: number; error?: string }>({
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        if (!cancelled) setState({ loading: false, error: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing' });
        return;
      }
      try {
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data, error } = await client.schema('zhiyu').from('_meta').select('*');
        if (cancelled) return;
        if (error) setState({ loading: false, error: error.message });
        else setState({ loading: false, rows: data?.length ?? 0 });
      } catch (e) {
        if (!cancelled) setState({ loading: false, error: (e as Error).message });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui', padding: 32 }}>
      <h2>Supabase debug</h2>
      {state.loading ? (
        <p data-testid="status">Loading…</p>
      ) : state.error ? (
        <p data-testid="status" style={{ color: 'crimson' }}>error: {state.error}</p>
      ) : (
        <p data-testid="status">rows: {state.rows}</p>
      )}
    </main>
  );
}

function DebugThrow(): JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('frontend debug-throw');
    }, 50);
  }, []);
  return <p>Throwing in 50ms…</p>;
}

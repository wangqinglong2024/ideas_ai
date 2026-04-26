const ADMIN_API_BASE = import.meta.env.VITE_ADMIN_API_BASE ?? '';

export default function App(): JSX.Element {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 32, maxWidth: 720 }}>
      <h1>知语 Admin</h1>
      <p>B 端管理后台 · dev placeholder</p>
      <p>Admin API: <code>{ADMIN_API_BASE || '(unset)'}</code></p>
    </main>
  );
}

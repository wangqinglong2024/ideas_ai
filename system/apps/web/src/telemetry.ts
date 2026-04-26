/**
 * Global frontend telemetry: forward uncaught errors and unhandled rejections
 * to the BE telemetry endpoint. Best-effort; failures are swallowed.
 */
const API_BASE = import.meta.env.VITE_API_BASE ?? '';
const ENDPOINT = `${API_BASE}/api/v1/_telemetry/error`;

function send(payload: Record<string, unknown>): void {
  if (!API_BASE) return;
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else {
      void fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body, keepalive: true });
    }
  } catch {
    /* ignore */
  }
}

window.addEventListener('error', (event) => {
  send({
    message: event.message || 'window.error',
    stack: event.error?.stack,
    context: { source: event.filename, line: event.lineno, col: event.colno, kind: 'window.error' },
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as Error | string | undefined;
  send({
    message: typeof reason === 'string' ? reason : reason?.message ?? 'unhandledrejection',
    stack: typeof reason === 'object' ? reason?.stack : undefined,
    context: { kind: 'unhandledrejection' },
  });
});

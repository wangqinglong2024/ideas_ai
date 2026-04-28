import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type ToastKind = 'success' | 'error' | 'info';
export type ToastItem = { id: number; kind: ToastKind; message: string; ttl: number };

type ToastCtx = {
  push: (kind: ToastKind, message: string, ttl?: number) => void;
  success: (message: string, ttl?: number) => void;
  error: (message: string, ttl?: number) => void;
  info: (message: string, ttl?: number) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => setItems((xs) => xs.filter((x) => x.id !== id)), []);
  const push = useCallback((kind: ToastKind, message: string, ttl?: number) => {
    const id = ++idRef.current;
    const finalTtl = ttl ?? (kind === 'error' ? 4000 : 2000);
    setItems((xs) => [...xs, { id, kind, message, ttl: finalTtl }]);
    window.setTimeout(() => remove(id), finalTtl);
  }, [remove]);

  const api = useMemo<ToastCtx>(() => ({
    push,
    success: (m, t) => push('success', m, t),
    error: (m, t) => push('error', m, t),
    info: (m, t) => push('info', m, t),
  }), [push]);

  return (
    <Ctx.Provider value={api}>
      {children}
      <div className="zy-toast-stack" data-testid="toast-stack">
        {items.map((it) => (
          <div key={it.id} role="status" data-testid={`toast-${it.kind}`} className={`zy-toast zy-toast-${it.kind}`} onClick={() => remove(it.id)}>
            {it.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast(): ToastCtx {
  const v = useContext(Ctx);
  if (!v) {
    // 容错：提供默认实现，避免脱离 Provider 报错
    return {
      push: (_k, m) => { try { console.warn('[toast]', m); } catch { /* noop */ } },
      success: (m) => { try { console.log('[toast.success]', m); } catch { /* noop */ } },
      error: (m) => { try { console.warn('[toast.error]', m); } catch { /* noop */ } },
      info: (m) => { try { console.log('[toast.info]', m); } catch { /* noop */ } },
    };
  }
  return v;
}

// 提供一个全局事件钩子（备选）
export function useToastBeacon(register: (api: ToastCtx) => void) {
  const api = useToast();
  useEffect(() => { register(api); }, [api, register]);
}

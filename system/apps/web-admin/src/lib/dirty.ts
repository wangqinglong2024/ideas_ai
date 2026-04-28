// 极简 dirty 守卫：beforeunload + 路由 onBeforeNavigate（由调用方在页面级实现），
// 这里仅做最小通用的浏览器关闭/刷新拦截，配合在路由切换处主动检查 dirty 后弹 D-6。
import { useEffect, useRef } from 'react';

export function useBeforeUnloadGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return undefined;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);
}

export function useDirtyState<T>(initial: T): {
  value: T;
  setValue: (v: T | ((p: T) => T)) => void;
  isDirty: () => boolean;
  baseline: () => T;
  reset: (next?: T) => void;
} {
  const baseRef = useRef<T>(initial);
  const valRef = useRef<T>(initial);
  const setValue = (v: T | ((p: T) => T)) => {
    valRef.current = typeof v === 'function' ? (v as (p: T) => T)(valRef.current) : v;
  };
  const isDirty = () => JSON.stringify(baseRef.current) !== JSON.stringify(valRef.current);
  const baseline = () => baseRef.current;
  const reset = (next?: T) => { baseRef.current = next ?? valRef.current; valRef.current = baseRef.current; };
  return { value: valRef.current, setValue, isDirty, baseline, reset };
}

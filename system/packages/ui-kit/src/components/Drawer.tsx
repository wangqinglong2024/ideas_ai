import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '../lib/cn.ts';

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number | string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
  testId?: string;
  className?: string;
};

export function Drawer({ open, onClose, title, width = 600, children, footer, side = 'right', testId, className }: DrawerProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="zy-drawer-mask"
      data-testid={testId ?? 'drawer'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <aside
        className={cn('zy-drawer', `zy-drawer-${side}`, 'zy-glass', className)}
        role="dialog"
        aria-modal="true"
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined && (
          <div className="zy-drawer-head">
            <div className="zy-drawer-title">{title}</div>
            <button type="button" className="zy-modal-close" data-testid="drawer-close" aria-label="close" onClick={onClose}>×</button>
          </div>
        )}
        <div className="zy-drawer-body">{children}</div>
        {footer && <div className="zy-drawer-foot">{footer}</div>}
      </aside>
    </div>
  );
}

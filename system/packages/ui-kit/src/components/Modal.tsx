import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { cn } from '../lib/cn.ts';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  width?: number | string;
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  testId?: string;
  className?: string;
};

export function Modal({ open, onClose, title, width = 480, children, footer, closeOnBackdrop = true, testId, className }: ModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="zy-modal-mask"
      data-testid={testId ?? 'modal'}
      onClick={(e) => { if (closeOnBackdrop && e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={cn('zy-modal', 'zy-glass', className)}
        role="dialog"
        aria-modal="true"
        style={{ width: typeof width === 'number' ? `${width}px` : width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title !== undefined && (
          <div className="zy-modal-head">
            <div className="zy-modal-title">{title}</div>
            <button type="button" className="zy-modal-close" data-testid="modal-close" aria-label="close" onClick={onClose}>×</button>
          </div>
        )}
        <div className="zy-modal-body">{children}</div>
        {footer && <div className="zy-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

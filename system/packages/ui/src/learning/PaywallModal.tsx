import { type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';

export interface PaywallOption {
  kind: 'subscription' | 'single_lesson' | 'single_course' | 'zc_unlock';
  label?: string;
  price_zc?: number;
  price_label?: string;
  highlight?: boolean;
}

export interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  reason?: 'no_entitlement' | 'paid_only' | string;
  lessonId?: string;
  courseId?: string;
  options: PaywallOption[];
  /** Trigger a specific option. Should call entitlements.unlockFake or real payment. */
  onSelect: (opt: PaywallOption) => Promise<void> | void;
  i18nLabels?: Partial<Record<'title' | 'subscribe' | 'single' | 'zc' | 'cancel', string>>;
}

export function PaywallModal({ open, onClose, reason, options, onSelect, i18nLabels }: PaywallModalProps): JSX.Element | null {
  if (!open) return null;
  const labels = {
    title: i18nLabels?.title ?? '解锁继续学习',
    subscribe: i18nLabels?.subscribe ?? '订阅会员',
    single: i18nLabels?.single ?? '单课购买',
    zc: i18nLabels?.zc ?? '智圆解锁',
    cancel: i18nLabels?.cancel ?? '稍后再说',
  };
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" data-testid="paywall-modal">
      <Card className="max-w-md w-full p-6 space-y-4">
        <h3 className="text-h3 text-center">{labels.title}</h3>
        {reason && <p className="text-sm text-center text-text-secondary">{reason}</p>}
        <div className="grid gap-2">
          {options.map((opt) => (
            <Button
              key={opt.kind + (opt.label ?? '')}
              variant={opt.highlight ? 'primary' : 'secondary'}
              onClick={() => void onSelect(opt)}
              data-testid={`paywall-${opt.kind}`}
            >
              {opt.label ??
                (opt.kind === 'subscription'
                  ? labels.subscribe
                  : opt.kind === 'zc_unlock'
                    ? `${labels.zc} (${opt.price_zc ?? '-'} ZC)`
                    : labels.single)}
              {opt.price_label && <span className="ml-2 text-xs opacity-80">{opt.price_label}</span>}
            </Button>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="ghost" onClick={onClose} data-testid="paywall-cancel">
            {labels.cancel}
          </Button>
        </div>
      </Card>
    </div>
  );
}

import type { ReactNode } from 'react';

type Item = { key: string; label: ReactNode; flag?: 'error' };

type Props = {
  items: Item[];
  active: string;
  onChange: (key: string) => void;
  testIdPrefix?: string;
};

export function Tabs({ items, active, onChange, testIdPrefix = 'tab' }: Props) {
  return (
    <div className="zy-tabs" role="tablist">
      {items.map((it) => (
        <button
          key={it.key}
          role="tab"
          aria-selected={it.key === active}
          type="button"
          data-testid={`${testIdPrefix}-${it.key}`}
          className={`zy-tab ${it.key === active ? 'zy-tab-active' : ''} ${it.flag === 'error' ? 'zy-tab-error' : ''}`}
          onClick={() => onChange(it.key)}
        >
          {it.label}
          {it.flag === 'error' && <span className="zy-tab-dot" aria-hidden />}
        </button>
      ))}
    </div>
  );
}

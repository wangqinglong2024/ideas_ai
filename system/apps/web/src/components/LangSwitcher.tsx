import { useEffect, useState } from 'react';
import {
  LOCALE_LABEL,
  UI_LOCALES,
  type UiLocale,
} from '@zhiyu/i18n';
import { changeLocale, getCurrentLocale, useT } from '@zhiyu/i18n/client';
import { loadFontsFor } from '@zhiyu/i18n/fonts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@zhiyu/ui';

/**
 * Compact dropdown language picker. Shows the current locale code as the
 * trigger; the popover lists all supported locales with their native labels.
 * Persists via i18next (localStorage) and triggers font preload for the
 * picked locale.
 */
export function LangSwitcher(): JSX.Element {
  const { t } = useT('common');
  const [current, setCurrent] = useState<UiLocale>(getCurrentLocale());

  useEffect(() => {
    loadFontsFor(current);
  }, [current]);

  const onPick = async (next: UiLocale): Promise<void> => {
    if (next === current) return;
    await changeLocale(next);
    loadFontsFor(next);
    setCurrent(next);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('nav.language')}
        data-testid="lang-switcher"
        className="inline-flex h-9 items-center gap-1.5 rounded-full glass-subtle px-3 text-sm text-text-secondary hover:text-text-primary transition outline-none"
      >
        <span className="uppercase font-medium">{current}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44">
        {UI_LOCALES.map((lng) => {
          const active = lng === current;
          return (
            <DropdownMenuItem
              key={lng}
              data-testid={`lang-option-${lng}`}
              lang={lng}
              onSelect={() => {
                void onPick(lng);
              }}
              className={active ? 'bg-rose-500/10 text-rose-700' : ''}
            >
              <span className="w-7 uppercase text-xs font-semibold tracking-wider">{lng}</span>
              <span>{LOCALE_LABEL[lng]}</span>
              {active && <span className="ms-auto text-rose-600">●</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

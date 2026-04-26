import { useTheme } from './theme-provider.js';
import type { ThemeMode } from '@zhiyu/tokens/apply';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/dropdown-menu.js';

const OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: 'light', label: '亮色', icon: '☀' },
  { value: 'dark', label: '暗色', icon: '☾' },
  { value: 'system', label: '跟随系统', icon: '⚙' },
];

export function ThemeMenu(): JSX.Element {
  const { mode, setMode } = useTheme();
  const current = OPTIONS.find((o) => o.value === mode) ?? OPTIONS[2]!;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="主题"
        data-testid="theme-trigger"
        className="inline-flex h-9 items-center gap-1.5 rounded-full glass-subtle px-3 text-sm text-text-secondary hover:text-text-primary transition outline-none"
      >
        <span aria-hidden>{current.icon}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {OPTIONS.map((opt) => {
          const active = mode === opt.value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onSelect={() => setMode(opt.value)}
              data-testid={`theme-option-${opt.value}`}
              className={active ? 'bg-rose-500/10 text-rose-700' : ''}
            >
              <span aria-hidden>{opt.icon}</span>
              <span>{opt.label}</span>
              {active && <span className="ms-auto text-rose-600">●</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

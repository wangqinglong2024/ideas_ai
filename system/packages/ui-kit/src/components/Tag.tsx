import type { ReactNode } from 'react';
import { cn } from '../lib/cn.ts';

type Variant = 'default' | 'success' | 'warn' | 'danger' | 'info' | 'brand';

export function Tag({ variant = 'default', children, className, testId }: { variant?: Variant; children: ReactNode; className?: string; testId?: string }) {
  return <span className={cn('zy-tag', `zy-tag-${variant}`, className)} data-testid={testId}>{children}</span>;
}

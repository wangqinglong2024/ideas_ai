import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

type Props = SelectHTMLAttributes<HTMLSelectElement>;
export function Select({ className, ...rest }: Props) {
  return <select {...rest} className={cn('zy-input zy-select', className)} />;
}

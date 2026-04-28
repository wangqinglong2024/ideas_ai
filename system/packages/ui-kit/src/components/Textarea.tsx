import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn.ts';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ className, ...rest }: Props) {
  return <textarea {...rest} className={cn('zy-input zy-textarea', className)} />;
}

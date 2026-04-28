import { cn } from '../lib/cn.ts';

export function Skeleton({ width, height = 16, className, rounded = 6 }: { width?: number | string; height?: number | string; className?: string; rounded?: number }) {
  return (
    <span
      className={cn('zy-skeleton', className)}
      aria-hidden
      style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, borderRadius: rounded }}
    />
  );
}

export function SkeletonCard({ height = 140 }: { height?: number }) {
  return <div className="zy-skeleton-card" style={{ height }} aria-hidden />;
}

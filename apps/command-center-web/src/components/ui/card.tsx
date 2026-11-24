import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'kpi' | 'subtle';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants = {
    default:
      'bg-[var(--color-surface-card,#FFFFFF)] border border-[var(--color-border-default,#DDD8CF)] rounded-[var(--radius-lg,12px)] shadow-sm',
    kpi: 'bg-[var(--color-surface-card,#FFFFFF)] border border-[var(--color-brand-line,#DDD8CF)] rounded-[var(--radius-lg,12px)] p-6 shadow-sm',
    subtle:
      'bg-[var(--color-surface-subtle,#EEE9E0)] border border-[var(--color-border-default,#DDD8CF)] rounded-[var(--radius-lg,12px)]',
  };

  return (
    <div className={cn(variants[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pb-3 flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-[18px] font-bold text-[var(--color-text-primary,#0B0C0E)]', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-[13px] text-[var(--color-text-secondary,#5B616B)]', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}

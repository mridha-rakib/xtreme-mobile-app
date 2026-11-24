import type React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  subtitle,
  actions,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('p-8 max-w-[1440px] mx-auto', className)}>
      {(title || actions) && (
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-[28px] font-bold text-[var(--color-brand-onyx,#0B0C0E)] tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-1 text-[15px] text-[var(--color-text-secondary,#5B616B)]">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

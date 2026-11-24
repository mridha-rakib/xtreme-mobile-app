import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading Command Center module...',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg,12px)] border border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)]',
        className,
      )}
    >
      <span className="size-8 animate-spin rounded-full border-3 border-[var(--color-accent-atlantic,#164D53)] border-t-transparent" />
      <p className="mt-4 text-[14px] font-medium text-[var(--color-text-secondary,#5B616B)]">
        {message}
      </p>
    </div>
  );
}

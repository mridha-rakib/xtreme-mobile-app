import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No items found',
  description = 'There are no records to display under the current filter criteria.',
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg,12px)] border border-dashed border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)]',
        className,
      )}
    >
      <div className="size-12 rounded-full bg-[var(--color-surface-subtle,#EEE9E0)] flex items-center justify-center text-[var(--color-text-secondary,#5B616B)] mb-4">
        📁
      </div>
      <h4 className="text-[16px] font-bold text-[var(--color-brand-onyx,#0B0C0E)]">{title}</h4>
      <p className="mt-1 text-[13px] text-[var(--color-text-secondary,#5B616B)] max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Unable to load module data',
  message = 'An unexpected operational error occurred while processing this request.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-10 text-center rounded-[var(--radius-lg,12px)] border border-[var(--color-semantic-danger,#B33A3A)] bg-[var(--color-semantic-danger-tint,#F9E6E6)]',
        className,
      )}
    >
      <div className="size-10 rounded-full bg-[var(--color-semantic-danger,#B33A3A)] text-white flex items-center justify-center font-bold mb-3">
        !
      </div>
      <h4 className="text-[15px] font-bold text-[var(--color-semantic-danger,#B33A3A)]">{title}</h4>
      <p className="mt-1 text-[13px] text-[#7A1D1D] max-w-md">{message}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} className="mt-4">
          Retry Operation
        </Button>
      )}
    </div>
  );
}

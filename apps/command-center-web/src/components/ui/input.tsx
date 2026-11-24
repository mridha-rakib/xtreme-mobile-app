import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-[var(--color-text-primary,#0B0C0E)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-[48px] w-full rounded-[var(--radius-md,8px)] border border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)] px-3.5 text-[14px] text-[var(--color-text-primary,#0B0C0E)] placeholder:text-[var(--color-text-placeholder,#A6A19A)] transition-colors focus:border-[var(--color-accent-atlantic,#164D53)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-atlantic,#164D53)] disabled:bg-[var(--color-surface-subtle,#EEE9E0)] disabled:opacity-60',
            error &&
              'border-[var(--color-semantic-danger,#B33A3A)] focus:border-[var(--color-semantic-danger,#B33A3A)] focus:ring-[var(--color-semantic-danger,#B33A3A)]',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="text-[12px] text-[var(--color-semantic-danger,#B33A3A)]">{error}</p>
        ) : helperText ? (
          <p className="text-[12px] text-[var(--color-text-secondary,#5B616B)]">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

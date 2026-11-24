import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, helperText, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-[13px] font-medium text-[var(--color-text-primary,#0B0C0E)]"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-[48px] w-full rounded-[var(--radius-md,8px)] border border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)] px-3.5 text-[14px] text-[var(--color-text-primary,#0B0C0E)] transition-colors focus:border-[var(--color-accent-atlantic,#164D53)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent-atlantic,#164D53)] disabled:bg-[var(--color-surface-subtle,#EEE9E0)] disabled:opacity-60',
            error &&
              'border-[var(--color-semantic-danger,#B33A3A)] focus:border-[var(--color-semantic-danger,#B33A3A)]',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-[12px] text-[var(--color-semantic-danger,#B33A3A)]">{error}</p>
        ) : helperText ? (
          <p className="text-[12px] text-[var(--color-text-secondary,#5B616B)]">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = 'Select';

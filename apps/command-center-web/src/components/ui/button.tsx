import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'premium' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-[var(--radius-lg,12px)] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F5E8D] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary:
        'bg-[var(--color-action-primary-bg,#0B0C0E)] text-[var(--color-action-primary-text,#FFFFFF)] hover:bg-[#17191D]',
      secondary:
        'bg-[var(--color-surface-card,#FFFFFF)] border border-[var(--color-border-default,#DDD8CF)] text-[var(--color-text-primary,#0B0C0E)] hover:bg-[#EEE9E0]',
      premium:
        'bg-[var(--color-action-premium-bg,#C6A15B)] text-[var(--color-action-premium-text,#0B0C0E)] hover:bg-[#A88343]',
      danger: 'bg-[var(--color-semantic-danger,#B33A3A)] text-white hover:bg-[#922828]',
      ghost:
        'bg-transparent text-[var(--color-text-secondary,#5B616B)] hover:text-[var(--color-text-primary,#0B0C0E)] hover:bg-[#EEE9E0]',
    };

    const sizes = {
      sm: 'h-[36px] px-3.5 text-[13px]',
      md: 'h-[48px] px-5 text-[14px]',
      lg: 'h-[52px] px-6 text-[15px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';

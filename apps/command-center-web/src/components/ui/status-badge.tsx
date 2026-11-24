import { cn } from '@/lib/utils';

export type StatusBadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'atlantic'
  | 'champagne';

export interface StatusBadgeProps {
  label: string;
  variant?: StatusBadgeVariant;
  className?: string;
  showDot?: boolean;
}

export function StatusBadge({
  label,
  variant = 'neutral',
  className,
  showDot = true,
}: StatusBadgeProps) {
  const styles: Record<
    StatusBadgeVariant,
    { bg: string; text: string; dot: string; border: string }
  > = {
    success: {
      bg: 'bg-[var(--color-semantic-success-tint,#E6F2EC)]',
      text: 'text-[var(--color-semantic-success,#1F6B4A)]',
      dot: 'bg-[var(--color-semantic-success,#1F6B4A)]',
      border: 'border-[#A5D6A7]',
    },
    warning: {
      bg: 'bg-[var(--color-semantic-warning-tint,#F7EFD9)]',
      text: 'text-[var(--color-semantic-warning,#8A5610)]',
      dot: 'bg-[var(--color-semantic-warning,#8A5610)]',
      border: 'border-[#FFE082]',
    },
    danger: {
      bg: 'bg-[var(--color-semantic-danger-tint,#F9E6E6)]',
      text: 'text-[var(--color-semantic-danger,#B33A3A)]',
      dot: 'bg-[var(--color-semantic-danger,#B33A3A)]',
      border: 'border-[#FFCDD2]',
    },
    info: {
      bg: 'bg-[var(--color-semantic-info-tint,#E8F0F8)]',
      text: 'text-[var(--color-semantic-info,#2F5E8D)]',
      dot: 'bg-[var(--color-semantic-info,#2F5E8D)]',
      border: 'border-[#BBDEFB]',
    },
    neutral: {
      bg: 'bg-[var(--color-surface-subtle,#EEE9E0)]',
      text: 'text-[var(--color-text-secondary,#5B616B)]',
      dot: 'bg-[var(--color-text-secondary,#5B616B)]',
      border: 'border-[var(--color-border-default,#DDD8CF)]',
    },
    atlantic: {
      bg: 'bg-[var(--color-accent-atlantic-tint,#DDEBEC)]',
      text: 'text-[var(--color-accent-atlantic,#164D53)]',
      dot: 'bg-[var(--color-accent-atlantic,#164D53)]',
      border: 'border-[#B2DFDB]',
    },
    champagne: {
      bg: 'bg-[var(--color-accent-champagne-tint,#F1E7D2)]',
      text: 'text-[var(--color-accent-champagne-dark,#A88343)]',
      dot: 'bg-[var(--color-accent-champagne-dark,#A88343)]',
      border: 'border-[#FFE082]',
    },
  };

  const current = styles[variant] || styles.neutral;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold border',
        current.bg,
        current.text,
        current.border,
        className,
      )}
    >
      {showDot && <span className={cn('size-1.5 rounded-full shrink-0', current.dot)} />}
      <span>{label}</span>
    </span>
  );
}

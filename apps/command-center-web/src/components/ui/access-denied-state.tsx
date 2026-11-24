import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface AccessDeniedStateProps {
  moduleName?: string;
  roleName?: string;
  className?: string;
}

export function AccessDeniedState({
  moduleName = 'this operational module',
  roleName,
  className,
}: AccessDeniedStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-[var(--radius-lg,12px)] border border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)] shadow-sm max-w-2xl mx-auto my-8',
        className,
      )}
    >
      <div className="size-12 rounded-full bg-[var(--color-semantic-warning-tint,#F7EFD9)] text-[var(--color-semantic-warning,#8A5610)] flex items-center justify-center text-[20px] mb-4">
        🔒
      </div>
      <h3 className="text-[18px] font-bold text-[var(--color-brand-onyx,#0B0C0E)]">
        Access Denied
      </h3>
      <p className="mt-2 text-[14px] text-[var(--color-text-secondary,#5B616B)] max-w-md">
        Your current operational role {roleName ? <strong>({roleName})</strong> : ''} does not have
        permission to access {moduleName}.
      </p>
      <p className="mt-1 text-[12px] text-[var(--color-text-placeholder,#A6A19A)]">
        Figma Governance: No protected module or business data is rendered before authorization
        resolves.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-[36px] items-center justify-center rounded-[var(--radius-md,8px)] bg-[var(--color-action-primary-bg,#0B0C0E)] px-4 text-[13px] font-semibold text-white hover:bg-[#17191D]"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

'use client';

import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useCommandCenterSession } from '@/lib/auth/session';
import { cn } from '@/lib/utils';

export function TopBar({ className }: { className?: string }) {
  const { user, isAuthenticated, logout } = useCommandCenterSession();

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex h-[var(--topbar-height,72px)] w-full items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)] px-8 shadow-xs',
        className,
      )}
    >
      {/* Search / Command input placeholder */}
      <div className="flex h-[39px] w-[435px] items-center rounded-[var(--radius-md,8px)] bg-[var(--color-brand-sand,#EEE9E0)] px-3 text-[14px]">
        <Search className="mr-2.5 size-4 text-[var(--color-brand-slate,#5B616B)]" />
        <input
          type="text"
          placeholder="Search / command"
          aria-label="Search"
          className="w-full bg-transparent text-[var(--color-text-primary,#0B0C0E)] placeholder:text-[var(--color-brand-slate,#5B616B)] focus:outline-none text-[13px]"
          readOnly
        />
      </div>

      {/* Right User Actions & Role indicator */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-full text-[var(--color-brand-slate,#5B616B)] hover:bg-[#EEE9E0] transition-colors"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--color-accent-champagne-dark,#A88343)]" />
        </button>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-[var(--color-border-default,#DDD8CF)]">
            <div className="flex size-8 items-center justify-center rounded-full bg-[var(--color-surface-subtle,#EEE9E0)] text-[var(--color-brand-slate,#5B616B)]">
              <UserIcon className="size-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold text-[var(--color-text-primary,#0B0C0E)] leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] font-medium text-[var(--color-text-secondary,#5B616B)]">
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="ml-2 text-[12px] text-[var(--color-semantic-danger,#B33A3A)] hover:underline"
            >
              Sign out
            </button>
          </div>
        ) : (
          <span className="text-[12px] text-[var(--color-text-secondary,#5B616B)]">
            Unauthenticated
          </span>
        )}
      </div>
    </header>
  );
}

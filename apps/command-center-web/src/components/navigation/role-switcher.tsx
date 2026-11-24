'use client';

import { useCommandCenterSession } from '@/lib/auth/session';
import { cn } from '@/lib/utils';
import type { CommandCenterRole } from '@/types';

export function RoleSwitcher({ className }: { className?: string }) {
  const { user, isDemoMode, switchPersona, logout, resetState } = useCommandCenterSession();

  // In production builds, this entire QA control is completely hidden and fails closed.
  if (!isDemoMode) {
    return null;
  }

  const roles: { role: CommandCenterRole; label: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin' },
    { role: 'ADMIN', label: 'Admin' },
    { role: 'CONCIERGE', label: 'Concierge' },
    { role: 'VENDOR', label: 'Vendor' },
  ];

  return (
    <div
      className={cn(
        'rounded-[var(--radius-md,8px)] border border-[#C6A15B]/40 bg-[#FAF8F4] p-2 text-xs shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-bold text-[11px] uppercase tracking-wider text-[var(--color-accent-champagne-dark,#A88343)]">
          QA Preview Persona
        </span>
        <button
          type="button"
          onClick={resetState}
          className="text-[10px] text-[var(--color-text-secondary,#5B616B)] hover:text-black underline"
          title="Reset to default mock state"
        >
          Reset
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {roles.map(({ role, label }) => {
          const isActive = user?.role === role;
          return (
            <button
              type="button"
              key={role}
              onClick={() => switchPersona(role)}
              className={cn(
                'rounded px-2 py-1 text-[11px] font-semibold transition-colors',
                isActive
                  ? 'bg-[var(--color-accent-atlantic,#164D53)] text-white'
                  : 'bg-[#EEE9E0] text-[var(--color-text-secondary,#5B616B)] hover:bg-[#DDD8CF]',
              )}
            >
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={logout}
          className={cn(
            'rounded px-2 py-1 text-[11px] font-semibold transition-colors',
            !user
              ? 'bg-[#B33A3A] text-white'
              : 'bg-[#EEE9E0] text-[var(--color-text-secondary,#5B616B)] hover:bg-[#DDD8CF]',
          )}
        >
          Unauth
        </button>
      </div>
    </div>
  );
}

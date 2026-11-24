'use client';

import { BrandLogo } from '@/components/ui/brand-logo';
import { useCommandCenterSession } from '@/lib/auth/session';
import { getVisibleNavItems } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { NavigationItem } from './navigation-item';

export function Sidebar({ className }: { className?: string }) {
  const { user, isAuthenticated } = useCommandCenterSession();

  const navItems = user ? getVisibleNavItems(user.role) : [];

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex w-[var(--sidebar-width,240px)] flex-col bg-[var(--color-surface-inverse,#0B0C0E)] text-white shadow-xl',
        className,
      )}
    >
      {/* Brand Logo in Sidebar */}
      <div className="p-4 pb-2">
        <BrandLogo width={208} height={88} />
      </div>

      {/* Navigation items scroll area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
        {!isAuthenticated ? (
          <div className="px-2 py-4 text-xs text-white/60">
            <p className="font-semibold text-white/80">Secure operational access</p>
            <p className="mt-2 text-[11px] leading-relaxed">
              No protected module or business data is rendered before authorization resolves.
            </p>
          </div>
        ) : (
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavigationItem
                key={item.id}
                label={item.label}
                path={item.path}
                iconName={item.iconName}
                badgeCount={item.badgeCount}
              />
            ))}
          </nav>
        )}
      </div>

      {/* Footer Role / Profile */}
      <div className="border-t border-[#24272D] p-4">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between">
            <div className="flex flex-col truncate">
              <span className="text-[13px] font-semibold text-white truncate">{user.name}</span>
              <span className="text-[11px] text-white/60 capitalize">
                {user.role.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-white/50">Unauthenticated</div>
        )}
      </div>
    </aside>
  );
}

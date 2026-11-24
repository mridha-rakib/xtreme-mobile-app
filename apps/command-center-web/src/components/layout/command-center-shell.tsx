'use client';

import type React from 'react';
import { RoleSwitcher } from '@/components/navigation/role-switcher';
import { Sidebar } from '@/components/navigation/sidebar';
import { TopBar } from '@/components/navigation/top-bar';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { useCommandCenterSession } from '@/lib/auth/session';
import type { CommandCenterPermission } from '@/types';
import { hasCommandCenterPermission } from '@/types';

export interface CommandCenterShellProps {
  children: React.ReactNode;
  requiredPermission?: CommandCenterPermission;
}

export function CommandCenterShell({ children, requiredPermission }: CommandCenterShellProps) {
  const { user, isAuthenticated, isDemoMode } = useCommandCenterSession();

  const isPermitted =
    !requiredPermission || (user && hasCommandCenterPermission(user.role, requiredPermission));

  return (
    <div className="min-h-screen bg-[var(--color-surface-canvas,#FAF8F4)] text-[var(--color-text-primary,#0B0C0E)] flex flex-row">
      {/* 240px Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-[var(--sidebar-width,240px)] min-h-screen">
        <TopBar />

        {isDemoMode && (
          <aside
            aria-label="QA Controls"
            className="bg-[#FFF8E7] border-b border-[#E6D5B8] px-8 py-2 flex items-center justify-between"
          >
            <div className="text-[12px] text-[#8A5610] font-medium">
              ⚠️ <strong>Command Center QA Preview Mode:</strong> Active persona controls enabled.
              Fails closed in production builds.
            </div>
            <RoleSwitcher />
          </aside>
        )}

        <main className="flex-1">
          {!isAuthenticated && !isDemoMode ? (
            <AccessDeniedState moduleName="Command Center" />
          ) : !isPermitted ? (
            <AccessDeniedState roleName={user?.role} />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

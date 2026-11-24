'use client';

import { CommandCenterShell } from '@/components/layout/command-center-shell';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useCommandCenterSession } from '@/lib/auth/session';
import { mockRepository } from '@/lib/mock';

/**
 * Phase 4.0 Foundation Landing Page.
 * Explicitly marks project readiness and tooling foundation.
 * NOT counted as any of the 64 approved business screens.
 */
export default function CommandCenterFoundationPage() {
  const { user } = useCommandCenterSession();
  const kpis = mockRepository.getKpis(user?.role || 'SUPER_ADMIN', user?.vendorId);

  return (
    <CommandCenterShell requiredPermission="dashboard:view">
      <PageContainer
        title="Admin Web Command Center"
        subtitle="Phase 4.0 Foundation & Architecture Setup — Project Readiness State"
        actions={<StatusBadge label="Phase 4.0 Foundation Active" variant="success" showDot />}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="kpi">
            <span className="text-[13px] font-semibold text-[var(--color-text-secondary,#5B616B)]">
              Role-Scoped Bookings
            </span>
            <div className="text-[32px] font-bold text-[var(--color-brand-onyx,#0B0C0E)] mt-2">
              {kpis.roleScopedBookings}
            </div>
            <span className="text-[12px] text-[var(--color-accent-atlantic,#164D53)] font-medium">
              Deterministic Mock Fixture
            </span>
          </Card>

          <Card variant="kpi">
            <span className="text-[13px] font-semibold text-[var(--color-text-secondary,#5B616B)]">
              Assignments / Work
            </span>
            <div className="text-[32px] font-bold text-[var(--color-brand-onyx,#0B0C0E)] mt-2">
              {kpis.assignmentsWork}
            </div>
            <span className="text-[12px] text-[var(--color-accent-atlantic,#164D53)] font-medium">
              Reactive Operational Sync
            </span>
          </Card>

          <Card variant="kpi">
            <span className="text-[13px] font-semibold text-[var(--color-text-secondary,#5B616B)]">
              Concierge Requests
            </span>
            <div className="text-[32px] font-bold text-[var(--color-brand-onyx,#0B0C0E)] mt-2">
              {kpis.conciergeRequests}
            </div>
            <span className="text-[12px] text-[var(--color-accent-atlantic,#164D53)] font-medium">
              Front-Office Pipeline
            </span>
          </Card>

          <Card variant="kpi">
            <span className="text-[13px] font-semibold text-[var(--color-text-secondary,#5B616B)]">
              Role-Specific Items
            </span>
            <div className="text-[32px] font-bold text-[var(--color-brand-onyx,#0B0C0E)] mt-2">
              {kpis.roleSpecificItems}
            </div>
            <span className="text-[12px] text-[var(--color-accent-atlantic,#164D53)] font-medium">
              Effective Permission Scope
            </span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Architecture & Governance Status</CardTitle>
              <CardDescription>
                Figma-compliant web architecture foundation for upcoming Phase 4.1 batch screens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-[13px] text-[var(--color-text-secondary,#5B616B)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] pb-2">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  App Router & Tech Stack
                </span>
                <span className="font-mono text-xs">Next.js 15 + React 19 + Tailwind CSS</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] pb-2">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Design Tokens Extraction
                </span>
                <span className="font-mono text-xs">Figma 05_Command_Center (CSS vars)</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] pb-2">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Authoritative Roles
                </span>
                <span className="font-mono text-xs">SUPER_ADMIN, ADMIN, CONCIERGE, VENDOR</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Production Mode Policy
                </span>
                <span className="font-mono text-xs">Fail Closed (Zero Mock Bypass)</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session & Permissions Verification</CardTitle>
              <CardDescription>
                Active authentication session details for development and QA preview validation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-[13px] text-[var(--color-text-secondary,#5B616B)]">
              <div className="flex items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] pb-2">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Signed-in User
                </span>
                <span>{user?.name || 'Unauthenticated'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] pb-2">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Assigned Role
                </span>
                <span className="font-bold text-[var(--color-accent-atlantic,#164D53)]">
                  {user?.role || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-[var(--color-border-default,#DDD8CF)] pb-2">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Resource Scope
                </span>
                <span>
                  {user?.vendorId ? `Vendor ID: ${user.vendorId}` : 'Global Platform Scope'}
                </span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="font-medium text-[var(--color-text-primary,#0B0C0E)]">
                  Account Status
                </span>
                <StatusBadge label={user?.status || 'INACTIVE'} variant="success" showDot />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </CommandCenterShell>
  );
}

'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/ui/brand-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

/**
 * Route Architecture Placeholder for CC-AUTH-01 (Sign In).
 * Complete business screen implementation will begin in Phase 4.1.
 */
export default function SignInPlaceholderPage() {
  return (
    <div className="min-h-screen bg-[var(--color-surface-canvas,#FAF8F4)] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <BrandLogo width={220} height={90} />
        </div>

        <Card className="shadow-md border border-[var(--color-border-default,#DDD8CF)]">
          <CardHeader>
            <CardTitle>Command Center Sign In</CardTitle>
            <CardDescription>Concierge, Vendor, Admin and Super Admin access only.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Staff Email or Operational ID"
              placeholder="e.g. admin@xtreme.sn"
              defaultValue="superadmin@xtreme.sn"
              readOnly
            />
            <Input label="Password" type="password" defaultValue="••••••••" readOnly />
            <Link href="/" className="block w-full">
              <Button variant="primary" className="w-full">
                Enter Command Center
              </Button>
            </Link>
            <p className="text-[11px] text-[var(--color-text-secondary,#5B616B)] text-center">
              Phase 4.0 Architecture Route Placeholder
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { describe, expect, it } from 'vitest';
import { getVisibleNavItems } from '@/lib/permissions';
import { hasCommandCenterPermission } from '@/types';

describe('Command Center Role & Permissions Architecture', () => {
  it('strictly defines permissions according to authoritative matrix', () => {
    // SUPER_ADMIN has full permissions
    expect(hasCommandCenterPermission('SUPER_ADMIN', 'finance:view')).toBe(true);
    expect(hasCommandCenterPermission('SUPER_ADMIN', 'finance:manage')).toBe(true);
    expect(hasCommandCenterPermission('SUPER_ADMIN', 'access:view')).toBe(true);
    expect(hasCommandCenterPermission('SUPER_ADMIN', 'access:manage')).toBe(true);

    // ADMIN has operational & commercial permissions, but no finance:manage or access:manage
    expect(hasCommandCenterPermission('ADMIN', 'dashboard:view')).toBe(true);
    expect(hasCommandCenterPermission('ADMIN', 'customers:view')).toBe(true);
    expect(hasCommandCenterPermission('ADMIN', 'finance:view')).toBe(false);
    expect(hasCommandCenterPermission('ADMIN', 'access:view')).toBe(false);

    // CONCIERGE has front-office permissions only
    expect(hasCommandCenterPermission('CONCIERGE', 'concierge:view')).toBe(true);
    expect(hasCommandCenterPermission('CONCIERGE', 'concierge:manage')).toBe(true);
    expect(hasCommandCenterPermission('CONCIERGE', 'vendors:view')).toBe(false);
    expect(hasCommandCenterPermission('CONCIERGE', 'finance:view')).toBe(false);

    // VENDOR has strictly resource-scoped permissions
    expect(hasCommandCenterPermission('VENDOR', 'dashboard:view')).toBe(true);
    expect(hasCommandCenterPermission('VENDOR', 'assets:view')).toBe(true);
    expect(hasCommandCenterPermission('VENDOR', 'assets:manage')).toBe(true);
    expect(hasCommandCenterPermission('VENDOR', 'customers:view')).toBe(false);
    expect(hasCommandCenterPermission('VENDOR', 'pricing:view')).toBe(false);
    expect(hasCommandCenterPermission('VENDOR', 'finance:view')).toBe(false);
    expect(hasCommandCenterPermission('VENDOR', 'access:view')).toBe(false);
  });

  it('denies undocumented permissions by default', () => {
    // @ts-expect-error - testing invalid permission string
    expect(hasCommandCenterPermission('SUPER_ADMIN', 'unknown:action')).toBe(false);
  });

  it('filters visible navigation items based on active role', () => {
    const superAdminNav = getVisibleNavItems('SUPER_ADMIN');
    expect(superAdminNav.some((i) => i.id === 'finance')).toBe(true);
    expect(superAdminNav.some((i) => i.id === 'access')).toBe(true);

    const vendorNav = getVisibleNavItems('VENDOR');
    expect(vendorNav.some((i) => i.id === 'home')).toBe(true);
    expect(vendorNav.some((i) => i.id === 'assets')).toBe(true);
    expect(vendorNav.some((i) => i.id === 'customers')).toBe(false);
    expect(vendorNav.some((i) => i.id === 'pricing')).toBe(false);
    expect(vendorNav.some((i) => i.id === 'finance')).toBe(false);
    expect(vendorNav.some((i) => i.id === 'access')).toBe(false);
  });
});

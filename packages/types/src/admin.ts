/**
 * XTREME Concierge — Admin Web Command Center Types
 * Authoritative role-based permission architecture for 05_Command_Center.
 */

export type CommandCenterRole = 'SUPER_ADMIN' | 'ADMIN' | 'CONCIERGE' | 'VENDOR';

export type CommandCenterPermission =
  | 'dashboard:view'
  | 'customers:view'
  | 'customers:manage'
  | 'bookings:view'
  | 'bookings:manage'
  | 'trips:view'
  | 'trips:manage'
  | 'concierge:view'
  | 'concierge:manage'
  | 'vendors:view'
  | 'vendors:manage'
  | 'assets:view'
  | 'assets:manage'
  | 'availability:view'
  | 'availability:manage'
  | 'pricing:view'
  | 'pricing:manage'
  | 'finance:view'
  | 'finance:manage'
  | 'catalog:view'
  | 'catalog:manage'
  | 'geography:view'
  | 'geography:manage'
  | 'assignments:view'
  | 'assignments:manage'
  | 'access:view'
  | 'access:manage'
  | 'support:view';

/**
 * Authoritative Role-Permission Matrix.
 * Rule: Deny by default. Only explicitly declared permissions are granted.
 */
export const COMMAND_CENTER_ROLE_PERMISSIONS: Record<
  CommandCenterRole,
  readonly CommandCenterPermission[]
> = {
  SUPER_ADMIN: [
    'dashboard:view',
    'customers:view',
    'customers:manage',
    'bookings:view',
    'bookings:manage',
    'trips:view',
    'trips:manage',
    'concierge:view',
    'concierge:manage',
    'vendors:view',
    'vendors:manage',
    'assets:view',
    'assets:manage',
    'availability:view',
    'availability:manage',
    'pricing:view',
    'pricing:manage',
    'finance:view',
    'finance:manage',
    'catalog:view',
    'catalog:manage',
    'geography:view',
    'geography:manage',
    'assignments:view',
    'assignments:manage',
    'access:view',
    'access:manage',
    'support:view',
  ],
  ADMIN: [
    'dashboard:view',
    'customers:view',
    'customers:manage',
    'bookings:view',
    'bookings:manage',
    'trips:view',
    'trips:manage',
    'concierge:view',
    'concierge:manage',
    'vendors:view',
    'vendors:manage',
    'assets:view',
    'assets:manage',
    'availability:view',
    'availability:manage',
    'pricing:view',
    'catalog:view',
    'catalog:manage',
    'geography:view',
    'geography:manage',
    'assignments:view',
    'assignments:manage',
    'support:view',
  ],
  CONCIERGE: [
    'dashboard:view',
    'customers:view',
    'bookings:view',
    'bookings:manage',
    'trips:view',
    'trips:manage',
    'concierge:view',
    'concierge:manage',
    'assignments:view',
    'support:view',
  ],
  VENDOR: [
    'dashboard:view',
    'bookings:view', // scoped to vendor
    'assets:view', // scoped to vendor
    'assets:manage', // scoped to vendor
    'availability:view', // scoped to vendor
    'availability:manage', // scoped to vendor
    'assignments:view', // scoped to vendor
    'support:view',
  ],
} as const;

export function hasCommandCenterPermission(
  role: CommandCenterRole,
  permission: CommandCenterPermission,
): boolean {
  const allowed = COMMAND_CENTER_ROLE_PERMISSIONS[role];
  return allowed ? allowed.includes(permission) : false;
}

export interface CommandCenterUser {
  id: string;
  email: string;
  name: string;
  role: CommandCenterRole;
  vendorId?: string; // Resource-scoping identifier for VENDOR role
  avatarUrl?: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLoginAt?: string;
}

export interface CommandCenterSession {
  user: CommandCenterUser | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  isLoading: boolean;
}

export interface CommandCenterNavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  requiredPermission: CommandCenterPermission;
  badgeCount?: number;
}

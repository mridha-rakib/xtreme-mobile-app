import {
  type CommandCenterNavItem,
  type CommandCenterRole,
  hasCommandCenterPermission,
} from '@/types';

export const COMMAND_CENTER_NAV_ITEMS: readonly CommandCenterNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    iconName: 'Home',
    requiredPermission: 'dashboard:view',
  },
  {
    id: 'customers',
    label: 'Customers',
    path: '/customers',
    iconName: 'Users',
    requiredPermission: 'customers:view',
  },
  {
    id: 'bookings',
    label: 'Bookings',
    path: '/bookings',
    iconName: 'Calendar',
    requiredPermission: 'bookings:view',
  },
  {
    id: 'trips',
    label: 'Trips',
    path: '/trips',
    iconName: 'Plane',
    requiredPermission: 'trips:view',
  },
  {
    id: 'concierge',
    label: 'Concierge',
    path: '/concierge',
    iconName: 'Bell',
    requiredPermission: 'concierge:view',
  },
  {
    id: 'vendors',
    label: 'Vendors',
    path: '/vendors',
    iconName: 'Store',
    requiredPermission: 'vendors:view',
  },
  {
    id: 'assets',
    label: 'Assets',
    path: '/assets',
    iconName: 'Layers',
    requiredPermission: 'assets:view',
  },
  {
    id: 'availability',
    label: 'Availability',
    path: '/availability',
    iconName: 'CalendarCheck',
    requiredPermission: 'availability:view',
  },
  {
    id: 'pricing',
    label: 'Pricing',
    path: '/pricing',
    iconName: 'Tag',
    requiredPermission: 'pricing:view',
  },
  {
    id: 'finance',
    label: 'Finance',
    path: '/finance',
    iconName: 'BarChart3',
    requiredPermission: 'finance:view',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    path: '/catalog',
    iconName: 'BookOpen',
    requiredPermission: 'catalog:view',
  },
  {
    id: 'geography',
    label: 'Geography',
    path: '/geography',
    iconName: 'MapPin',
    requiredPermission: 'geography:view',
  },
  {
    id: 'assignments',
    label: 'Assignments',
    path: '/assignments',
    iconName: 'ClipboardList',
    requiredPermission: 'assignments:view',
  },
  {
    id: 'access',
    label: 'Access',
    path: '/access',
    iconName: 'Key',
    requiredPermission: 'access:view',
  },
  {
    id: 'support',
    label: 'Support & Legal',
    path: '/support',
    iconName: 'Shield',
    requiredPermission: 'support:view',
  },
] as const;

export function getVisibleNavItems(role: CommandCenterRole): CommandCenterNavItem[] {
  return COMMAND_CENTER_NAV_ITEMS.filter((item) =>
    hasCommandCenterPermission(role, item.requiredPermission),
  );
}

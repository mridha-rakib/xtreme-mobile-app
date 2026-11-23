/**
 * XTREME Concierge Design Tokens - Spacing, Radii, Shadows, Layout
 */

export const spacing = {
  none: 0,
  '3xs': 2,
  '2xs': 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
} as const;

export const radii = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 12,
  badge: 14,
  lg: 16,
  xl: 24,
  screen: 28,
  full: 9999,
} as const;

export const sizes = {
  control_s: 40,
  control_m: 48,
  control_l: 56,
} as const;

export const layout = {
  screenPaddingHorizontal: 22,
  screenPaddingVertical: 24,
  headerHeight: 56,
  bottomBarHeight: 64,
  maxContentWidth: 480,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0B0C0E',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#0B0C0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0B0C0E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;

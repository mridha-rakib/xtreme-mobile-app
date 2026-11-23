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
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const layout = {
  screenPaddingHorizontal: 20,
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

/**
 * XTREME Concierge Design Tokens - Typography
 *
 * SPECIFICATION AUTHORITY NOTE (Visual Direction v1.0 & Design Tokens v1.0):
 * - DESIGN_SYSTEM_V1_TYPOGRAPHY: Exact typography roles from XTREME_Concierge_Design_Tokens_v1.0.json.
 * - SPEC_VERIFIED_TYPOGRAPHY: Weight definitions & primary font scale conventions from Visual Direction v1.0.
 */

export const DESIGN_SYSTEM_V1_TYPOGRAPHY = {
  display_xl: {
    fontFamily: 'Noto Serif Display',
    fontSize: 48,
    fontWeight: '600' as const,
    lineHeight: 56,
    letterSpacing: -0.5,
  },
  display_lg: {
    fontFamily: 'Noto Serif Display',
    fontSize: 40,
    fontWeight: '600' as const,
    lineHeight: 48,
    letterSpacing: -0.3,
  },
  heading_h1: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.2,
  },
  heading_h2: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.1,
  },
  heading_h3: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  title_lg: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  title_md: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  body_lg: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body_md: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
    letterSpacing: 0,
  },
  label_md: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  label_sm: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
    letterSpacing: 0.15,
  },
  caption: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.1,
  },
} as const;

export const SPEC_VERIFIED_TYPOGRAPHY = {
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
} as const;

export const PROPOSED_TYPOGRAPHY = {
  weights: {
    heavy: '800' as const,
  },
  sizes: {
    '2xs': 10,
    '4xl': 34,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const typography = {
  sizes: {
    ...SPEC_VERIFIED_TYPOGRAPHY.sizes,
    ...PROPOSED_TYPOGRAPHY.sizes,
  },
  weights: {
    ...SPEC_VERIFIED_TYPOGRAPHY.weights,
    ...PROPOSED_TYPOGRAPHY.weights,
  },
  lineHeights: PROPOSED_TYPOGRAPHY.lineHeights,
  roles: DESIGN_SYSTEM_V1_TYPOGRAPHY,
} as const;

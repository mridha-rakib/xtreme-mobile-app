/**
 * XTREME Concierge Design Tokens - Typography
 *
 * SPECIFICATION AUTHORITY NOTE (Visual Direction v1.0 & Phase 1.5 Audit):
 * - SPEC_VERIFIED_TYPOGRAPHY: Weight definitions & primary font scale conventions from Visual Direction v1.0.
 * - PROPOSED_TYPOGRAPHY: Micro-typography steps (2xs, 4xl, line-height multipliers) awaiting Figma confirmation.
 */

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
} as const;

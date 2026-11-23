/**
 * XTREME Concierge Design Tokens - Colors
 *
 * SPECIFICATION & FIGMA DISTINCTION NOTE (Visual Direction & Design System v1.0):
 * - SPEC_DERIVED_COLORS: Strictly verified against the approved Visual Direction & Design System v1.0.
 *   Contains ONLY documented palette values (Atlantic #164D53, Ivory #FAF8F4, Obsidian #0B0C0E, Gold #C6A15B, Line #DDD8CF, Slate #5B616B, Surface #FFFFFF).
 * - PROPOSED_COLORS: Proposed engineering placeholders awaiting live Figma canvas inspection (including unconfirmed secondary terracotta accent, status badge tints, and elevated surfaces).
 * - FIGMA-VERIFIED TOKENS: NONE at this stage (Figma MCP API quota limit blocked live node inspection).
 */

/** Colors explicitly documented in Visual Direction & Design System v1.0 */
export const SPEC_DERIVED_COLORS = {
  atlantic: '#164D53', // Atlantic Ocean Deep Teal (Primary Luxury Brand Cornerstone)
  background: '#FAF8F4', // Warm Ivory / Saharan Sand
  ink: '#0B0C0E', // Deep Obsidian / Midnight Black
  line: '#DDD8CF', // Subtle Warm Stone Border
  accentGold: '#C6A15B', // Champagne Gold / Warm Ochre
  muted: '#5B616B', // Slate Charcoal
  surface: '#FFFFFF', // Pure White Card Surface
} as const;

/** Proposed engineering tokens (awaiting live Figma canvas node verification) */
export const PROPOSED_COLORS = {
  // Proposed secondary warm accent (unconfirmed in authoritative v1.0 spec)
  accentTerracotta: '#C85A32',
  accentTerracottaLight: '#FBECE7',

  // Surfaces & variations
  backgroundElevated: '#F5F2EB',
  surfaceSubtle: '#F7F5F0',
  lineSubtle: '#EDE8E0',
  inkSecondary: '#2C3038',
  mutedLight: '#8A919E',
  inverseText: '#FFFFFF',
  accentGoldDark: '#9E7E40',
  accentGoldLight: '#F3E9D2',
  atlanticLight: '#E8F1F2',

  // Semantic status badges
  status: {
    confirmed: {
      bg: '#EAF6EC',
      text: '#1B5E20',
      border: '#A5D6A7',
    },
    pending: {
      bg: '#FFF8E1',
      text: '#8A5300',
      border: '#FFE082',
    },
    inProgress: {
      bg: '#E8F1FC',
      text: '#0D47A1',
      border: '#90CAF9',
    },
    assigned: {
      bg: '#F3E5F5',
      text: '#4A148C',
      border: '#CE93D8',
    },
    completed: {
      bg: '#E8F5E9',
      text: '#2E7D32',
      border: '#81C784',
    },
    cancelled: {
      bg: '#FEECEC',
      text: '#B71C1C',
      border: '#EF9A9A',
    },
  },
} as const;

export const colors = {
  ...SPEC_DERIVED_COLORS,
  ...PROPOSED_COLORS,
} as const;

export type ColorToken = keyof typeof colors;

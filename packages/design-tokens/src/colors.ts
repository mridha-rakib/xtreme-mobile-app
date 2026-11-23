/**
 * XTREME Concierge Design Tokens - Colors
 *
 * SPECIFICATION & FIGMA DISTINCTION NOTE (Visual Direction & Design System v1.0):
 * - SPEC_DERIVED_COLORS: Authoritative tokens from XTREME_Concierge_Design_Tokens_v1.0.json
 *   and Visual Direction & Design System v1.0.
 * - FIGMA-VERIFIED TOKENS: Extracted directly from approved high-fidelity design frames (v1.1 gallery).
 * - PROPOSED_COLORS: Secondary experimental tokens clearly segregated from the authoritative palette.
 */

/** Authoritative primitives and semantics from Design System v1.0 JSON */
export const DESIGN_SYSTEM_V1_TOKENS = {
  // Primitives
  brand_onyx: '#0B0C0E',
  brand_carbon: '#17191D',
  brand_graphite: '#24272D',
  brand_slate: '#5B616B',
  brand_stone: '#A6A19A',
  brand_line: '#DDD8CF',
  brand_sand: '#EEE9E0',
  brand_ivory: '#FAF8F4',
  brand_white: '#FFFFFF',

  // Accents
  accent_champagne: '#C6A15B',
  accent_champagneDark: '#A88343',
  accent_champagneTint: '#F1E7D2',
  accent_atlantic: '#164D53',
  accent_atlanticMid: '#1F626A',
  accent_atlanticTint: '#DDEBEC',

  // Semantics
  semantic_success: '#1F6B4A',
  semantic_successTint: '#E6F2EC',
  semantic_warning: '#8A5610',
  semantic_warningTint: '#F7EFD9',
  semantic_danger: '#B33A3A',
  semantic_dangerTint: '#F9E6E6',
  semantic_info: '#2F5E8D',
  semantic_infoTint: '#E8F0F8',

  // Surfaces & Text semantics
  surface_canvas: '#FAF8F4',
  surface_card: '#FFFFFF',
  surface_subtle: '#EEE9E0',
  surface_inverse: '#0B0C0E',
  surface_accent: '#F1E7D2',
  text_primary: '#0B0C0E',
  text_secondary: '#5B616B',
  text_inverse: '#FFFFFF',
  text_link: '#164D53',
  border_default: '#DDD8CF',
  border_strong: '#A6A19A',
  action_primary_bg: '#0B0C0E',
  action_primary_text: '#FFFFFF',
  action_secondary_bg: '#FFFFFF',
  action_secondary_text: '#0B0C0E',
  action_premium_bg: '#C6A15B',
  action_premium_text: '#0B0C0E',
  focus_ring: '#2F5E8D',
} as const;

/** Canonical alias mapping matching original project naming conventions */
export const SPEC_DERIVED_COLORS = {
  atlantic: DESIGN_SYSTEM_V1_TOKENS.accent_atlantic,
  background: DESIGN_SYSTEM_V1_TOKENS.surface_canvas,
  ink: DESIGN_SYSTEM_V1_TOKENS.brand_onyx,
  line: DESIGN_SYSTEM_V1_TOKENS.border_default,
  accentGold: DESIGN_SYSTEM_V1_TOKENS.accent_champagne,
  muted: DESIGN_SYSTEM_V1_TOKENS.text_secondary,
  surface: DESIGN_SYSTEM_V1_TOKENS.surface_card,
} as const;

/** Proposed engineering tokens (awaiting live Figma canvas node verification) */
export const PROPOSED_COLORS = {
  // Proposed secondary warm accent (unconfirmed in authoritative v1.0 spec)
  accentTerracotta: '#C85A32',
  accentTerracottaLight: '#FBECE7',

  // Surfaces & variations
  backgroundElevated: '#F5F2EB',
  surfaceSubtle: DESIGN_SYSTEM_V1_TOKENS.surface_subtle,
  lineSubtle: '#EDE8E0',
  inkSecondary: '#2C3038',
  mutedLight: '#8A919E',
  inverseText: '#FFFFFF',
  accentGoldDark: DESIGN_SYSTEM_V1_TOKENS.accent_champagneDark,
  accentGoldLight: DESIGN_SYSTEM_V1_TOKENS.accent_champagneTint,
  atlanticLight: DESIGN_SYSTEM_V1_TOKENS.accent_atlanticTint,

  // Semantic status badges
  status: {
    confirmed: {
      bg: DESIGN_SYSTEM_V1_TOKENS.semantic_successTint,
      text: DESIGN_SYSTEM_V1_TOKENS.semantic_success,
      border: '#A5D6A7',
    },
    pending: {
      bg: DESIGN_SYSTEM_V1_TOKENS.semantic_warningTint,
      text: DESIGN_SYSTEM_V1_TOKENS.semantic_warning,
      border: '#FFE082',
    },
    inProgress: {
      bg: DESIGN_SYSTEM_V1_TOKENS.semantic_infoTint,
      text: DESIGN_SYSTEM_V1_TOKENS.semantic_info,
      border: '#90CAF9',
    },
    assigned: {
      bg: '#F3E5F5',
      text: '#4A148C',
      border: '#CE93D8',
    },
    completed: {
      bg: DESIGN_SYSTEM_V1_TOKENS.semantic_successTint,
      text: DESIGN_SYSTEM_V1_TOKENS.semantic_success,
      border: '#81C784',
    },
    cancelled: {
      bg: DESIGN_SYSTEM_V1_TOKENS.semantic_dangerTint,
      text: DESIGN_SYSTEM_V1_TOKENS.semantic_danger,
      border: '#EF9A9A',
    },
  },
} as const;

export const colors = {
  ...SPEC_DERIVED_COLORS,
  ...PROPOSED_COLORS,
  ...DESIGN_SYSTEM_V1_TOKENS,
} as const;

export type ColorToken = keyof typeof colors;

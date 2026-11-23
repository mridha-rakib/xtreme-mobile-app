export * from './colors';
export * from './layout';
export * from './typography';

// Legacy compatibility alias for existing screens
import { colors } from './colors';
export const palette = {
  atlantic: colors.atlantic,
  background: colors.background,
  ink: colors.ink,
  line: colors.line,
  accent: colors.accentGold,
  muted: colors.muted,
  terracotta: colors.accentTerracotta,
} as const;

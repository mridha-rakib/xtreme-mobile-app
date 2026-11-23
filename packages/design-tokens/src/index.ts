export * from './colors';
export * from './layout';
export * from './typography';

// Legacy and semantic convenience aliases
import { colors } from './colors';
export const palette = {
  atlantic: colors.atlantic,
  background: colors.background,
  ink: colors.ink,
  line: colors.line,
  accent: colors.accentGold,
  muted: colors.muted,
  surface: colors.surface,
  terracotta: colors.accentTerracotta,
} as const;

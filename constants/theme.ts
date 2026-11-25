/**
 * Legacy theme shim.
 *
 * The canonical design tokens now live in `src/theme`. This file is kept so
 * existing screens keep working while they are migrated to `useTheme()` and
 * the new components in `src/ui`. Values mirror the dark-first palette.
 */
import { palette } from '@/src/theme/tokens';
import { darkColors } from '@/src/theme/themes';

export const Colors = {
  bg: darkColors.bg,
  bgLight: darkColors.surfaceElevated,
  bgCard: darkColors.surface,
  primary: darkColors.accent,
  primaryGlow: darkColors.accentMuted,
  primaryLight: darkColors.accentMuted,
  blue: darkColors.accent,
  blueGlow: darkColors.accentMuted,
  pink: darkColors.accent,
  pinkGlow: darkColors.accentMuted,
  white: palette.white,
  text: darkColors.text,
  textSecondary: darkColors.textSecondary,
  textMuted: darkColors.textTertiary,
  border: darkColors.border,
  borderActive: darkColors.borderStrong,
  error: darkColors.danger,
  errorBg: darkColors.dangerMuted,
  errorBorder: 'rgba(251, 113, 133, 0.28)',
  success: darkColors.success,
  overlay: darkColors.overlay,
};

export const FontFamily = 'Poppins_400Regular';

export const BorderRadius = {
  sm: 10,
  md: 14,
  lg: 18,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const FontSize = {
  xs: 13,
  sm: 14,
  md: 15,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
};

export const Animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  stagger: {
    card: 80,
  },
};

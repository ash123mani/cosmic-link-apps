import { palette } from './tokens';

export interface ThemeColors {
  bg: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  border: string;
  borderStrong: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  accent: string;
  accentMuted: string;
  accentSoft: string;
  onAccent: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  danger: string;
  dangerMuted: string;
  focusRing: string;
  overlay: string;
  skeleton: string;
  skeletonHighlight: string;
  star: string;
}

export const darkColors: ThemeColors = {
  bg: palette.ink950,
  surface: palette.ink900,
  surfaceElevated: palette.ink800,
  surfaceSunken: palette.ink850,
  border: palette.ink700,
  borderStrong: palette.ink600,
  text: '#F5F3FF',
  textSecondary: '#B9B3CE',
  textTertiary: '#8B85A0',
  accent: palette.violet500,
  accentMuted: 'rgba(139, 92, 246, 0.16)',
  accentSoft: 'rgba(139, 92, 246, 0.28)',
  onAccent: palette.white,
  success: palette.emerald400,
  successMuted: 'rgba(74, 222, 128, 0.14)',
  warning: palette.amber400,
  warningMuted: 'rgba(251, 191, 36, 0.14)',
  danger: palette.rose400,
  dangerMuted: 'rgba(251, 113, 133, 0.14)',
  focusRing: palette.violet400,
  overlay: 'rgba(4, 3, 9, 0.72)',
  skeleton: 'rgba(255, 255, 255, 0.06)',
  skeletonHighlight: 'rgba(255, 255, 255, 0.12)',
  star: 'rgba(255, 255, 255, 0.85)',
};

export const lightColors: ThemeColors = {
  bg: palette.paper50,
  surface: palette.paper0,
  surfaceElevated: palette.paper0,
  surfaceSunken: palette.paper100,
  border: palette.paper200,
  borderStrong: palette.paper300,
  text: palette.slate900,
  textSecondary: palette.slate500,
  textTertiary: palette.slate400,
  accent: palette.violet600,
  accentMuted: 'rgba(124, 58, 237, 0.10)',
  accentSoft: 'rgba(124, 58, 237, 0.18)',
  onAccent: palette.white,
  success: palette.emerald500,
  successMuted: 'rgba(34, 197, 94, 0.12)',
  warning: palette.amber500,
  warningMuted: 'rgba(245, 158, 11, 0.14)',
  danger: palette.rose500,
  dangerMuted: 'rgba(244, 63, 94, 0.10)',
  focusRing: palette.violet600,
  overlay: 'rgba(21, 19, 31, 0.42)',
  skeleton: 'rgba(21, 19, 31, 0.07)',
  skeletonHighlight: 'rgba(21, 19, 31, 0.12)',
  star: 'rgba(124, 58, 237, 0.25)',
};

export type ThemeName = 'dark' | 'light';
export type ThemePreference = ThemeName | 'system';

export interface Theme {
  name: ThemeName;
  colors: ThemeColors;
  isDark: boolean;
}

export const themes: Record<ThemeName, Theme> = {
  dark: { name: 'dark', colors: darkColors, isDark: true },
  light: { name: 'light', colors: lightColors, isDark: false },
};

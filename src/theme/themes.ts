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
  bg: palette.darkBg,
  surface: palette.darkSurface,
  surfaceElevated: palette.darkSurfaceElevated,
  surfaceSunken: palette.darkSurfaceSunken,
  border: palette.darkBorder,
  borderStrong: palette.darkBorderStrong,
  text: palette.darkText,
  textSecondary: palette.darkTextSecondary,
  textTertiary: palette.darkTextTertiary,
  accent: '#6B63FF',
  accentMuted: 'rgba(107, 99, 255, 0.16)',
  accentSoft: 'rgba(107, 99, 255, 0.24)',
  onAccent: palette.white,
  success: '#4ADE80',
  successMuted: 'rgba(74, 222, 128, 0.14)',
  warning: '#F5D76E',
  warningMuted: 'rgba(245, 215, 110, 0.16)',
  danger: '#FF7A66',
  dangerMuted: 'rgba(255, 122, 102, 0.14)',
  focusRing: '#8B85FF',
  overlay: 'rgba(4, 8, 20, 0.62)',
  skeleton: 'rgba(255, 255, 255, 0.06)',
  skeletonHighlight: 'rgba(255, 255, 255, 0.12)',
  star: 'rgba(107, 99, 255, 0.35)',
};

export const lightColors: ThemeColors = {
  bg: palette.bodyBg,
  surface: palette.white,
  surfaceElevated: palette.white,
  surfaceSunken: '#ECEAF7',
  border: palette.blackLight,
  borderStrong: 'rgba(16, 1, 212, 0.25)',
  text: palette.blackMedium,
  textSecondary: palette.gray,
  textTertiary: '#9A9AA6',
  accent: palette.primary,
  accentMuted: 'rgba(16, 1, 212, 0.08)',
  accentSoft: 'rgba(16, 1, 212, 0.14)',
  onAccent: palette.white,
  success: palette.success,
  successMuted: 'rgba(31, 157, 85, 0.12)',
  warning: '#B88A00',
  warningMuted: 'rgba(225, 192, 60, 0.2)',
  danger: palette.error,
  dangerMuted: 'rgba(207, 70, 45, 0.1)',
  focusRing: palette.primary,
  overlay: 'rgba(42, 36, 56, 0.45)',
  skeleton: 'rgba(42, 36, 56, 0.07)',
  skeletonHighlight: 'rgba(42, 36, 56, 0.12)',
  star: 'rgba(16, 1, 212, 0.18)',
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

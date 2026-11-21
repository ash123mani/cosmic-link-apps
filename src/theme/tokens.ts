export const palette = {
  ink950: '#08060F',
  ink900: '#0F0C1A',
  ink850: '#141021',
  ink800: '#171226',
  ink700: '#241C38',
  ink600: '#33284D',
  ink500: '#4A3D68',

  violet700: '#6D28D9',
  violet600: '#7C3AED',
  violet500: '#8B5CF6',
  violet400: '#A78BFA',
  violet300: '#C4B5FD',
  violet200: '#DDD6FE',

  emerald400: '#4ADE80',
  emerald500: '#22C55E',
  amber400: '#FBBF24',
  amber500: '#F59E0B',
  rose400: '#FB7185',
  rose500: '#F43F5E',

  white: '#FFFFFF',
  paper0: '#FFFFFF',
  paper50: '#F7F6FB',
  paper100: '#EFECF7',
  paper200: '#E3E0EF',
  paper300: '#CFCBE0',

  slate900: '#15131F',
  slate800: '#211E2E',
  slate700: '#2E2A3E',
  slate500: '#5D5875',
  slate400: '#8A85A0',

  transparent: 'transparent',
} as const;

export const spacing = {
  '1': 4,
  '2': 8,
  '3': 12,
  '4': 16,
  '5': 20,
  '6': 24,
  '8': 32,
  '10': 40,
  '12': 48,
  '16': 64,
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  full: 9999,
} as const;

export const zIndex = {
  base: 0,
  card: 1,
  sticky: 10,
  overlay: 100,
  modal: 1000,
  toast: 2000,
} as const;

export const opacity = {
  disabled: 0.45,
  muted: 0.6,
  pressed: 0.85,
} as const;

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;

export const minTouchTarget = 44;

export const palette = {
  // Web brand
  primary: '#1001D4',
  primaryMedium: '#1001D4A1',
  primaryLight: '#1001D44F',
  primarySoft: 'rgba(16, 1, 212, 0.08)',
  primarySoftStrong: 'rgba(16, 1, 212, 0.12)',
  primaryBorder: 'rgba(16, 1, 212, 0.25)',

  white: '#FFFFFF',
  bodyBg: '#F5F4F9',
  black: '#000000',
  blackMedium: '#2A2438',
  blackLight: '#E1E1E4',
  gray: '#83838E',
  error: '#CF462D',
  warning: '#E1C03C',
  success: '#1F9D55',

  // Dark surfaces (brand-remapped)
  darkBg: '#0D1020',
  darkSurface: '#151A2E',
  darkSurfaceElevated: '#1C2340',
  darkSurfaceSunken: '#11172A',
  darkBorder: '#28314F',
  darkBorderStrong: '#364269',
  darkText: '#F5F6FF',
  darkTextSecondary: '#C3C8DC',
  darkTextTertiary: '#949BBA',

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
  control: 8,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
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

export const layout = {
  screenX: 20,
  headerHeight: 60,
  tabBarHeight: 64,
} as const;

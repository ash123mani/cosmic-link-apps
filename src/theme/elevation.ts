import type { ViewStyle } from 'react-native';
import type { Theme } from './themes';

export type ElevationLevel = 0 | 1 | 2 | 3;

export function elevation(level: ElevationLevel, theme: Theme): ViewStyle {
  if (level === 0) return {};

  if (theme.isDark) {
    return {
      shadowColor: '#000000',
      shadowOpacity: level === 1 ? 0.28 : level === 2 ? 0.36 : 0.45,
      shadowRadius: level === 1 ? 12 : level === 2 ? 20 : 28,
      shadowOffset: { width: 0, height: level === 1 ? 6 : level === 2 ? 10 : 16 },
      elevation: level === 1 ? 3 : level === 2 ? 6 : 10,
    };
  }

  return {
    shadowColor: '#15131F',
    shadowOpacity: level === 1 ? 0.06 : level === 2 ? 0.1 : 0.14,
    shadowRadius: level === 1 ? 10 : level === 2 ? 18 : 26,
    shadowOffset: { width: 0, height: level === 1 ? 4 : level === 2 ? 8 : 12 },
    elevation: level === 1 ? 2 : level === 2 ? 5 : 8,
  };
}

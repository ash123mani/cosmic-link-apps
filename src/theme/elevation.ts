import type { ViewStyle } from 'react-native';
import type { Theme } from './themes';

export type ElevationLevel = 0 | 1 | 2 | 3;

export function elevation(level: ElevationLevel, theme: Theme): ViewStyle {
  if (level === 0) return {};

  if (theme.isDark) {
    return {
      shadowColor: '#000000',
      shadowOpacity: level === 1 ? 0.24 : level === 2 ? 0.32 : 0.4,
      shadowRadius: level === 1 ? 12 : level === 2 ? 20 : 28,
      shadowOffset: { width: 0, height: level === 1 ? 6 : level === 2 ? 10 : 16 },
      elevation: level === 1 ? 3 : level === 2 ? 6 : 10,
    };
  }

  return {
    shadowColor: '#2A2438',
    shadowOpacity: level === 1 ? 0.08 : level === 2 ? 0.12 : 0.16,
    shadowRadius: level === 1 ? 12 : level === 2 ? 20 : 28,
    shadowOffset: { width: 0, height: level === 1 ? 4 : level === 2 ? 8 : 12 },
    elevation: level === 1 ? 2 : level === 2 ? 5 : 8,
  };
}

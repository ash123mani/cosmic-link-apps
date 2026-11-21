import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';

export function Spinner({ size = 'small', ...rest }: ActivityIndicatorProps) {
  const { colors } = useTheme();
  return <ActivityIndicator size={size} color={colors.accent} {...rest} />;
}

import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { elevation, type ElevationLevel } from '@/src/theme/elevation';
import { Pressable } from './Pressable';

export interface CardProps {
  children: ReactNode;
  padding?: number;
  elevationLevel?: ElevationLevel;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Card({
  children,
  padding = 16,
  elevationLevel = 1,
  onPress,
  style,
  accessibilityLabel,
}: CardProps) {
  const theme = useTheme();
  const { colors } = theme;

  const cardStyle = [
    styles.card,
    {
      padding,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    elevation(elevationLevel, theme.theme),
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={cardStyle}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
  },
});

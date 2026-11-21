import { type ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';

export interface IconButtonProps {
  icon: ReactNode;
  onPress?: () => void;
  accessibilityLabel: string;
  variant?: 'ghost' | 'surface' | 'accent';
  size?: number;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = 'ghost',
  size = 44,
  disabled = false,
  style,
  testID,
}: IconButtonProps) {
  const { colors } = useTheme();

  const backgroundColor =
    variant === 'surface'
      ? colors.surfaceElevated
      : variant === 'accent'
        ? colors.accentMuted
        : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      testID={testID}
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.sm,
          backgroundColor,
          opacity: disabled ? 0.4 : 1,
        },
        variant === 'surface' && { borderWidth: 1, borderColor: colors.border },
        style,
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

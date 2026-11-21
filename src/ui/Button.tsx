import { type ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, opacity } from '@/src/theme/tokens';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  accessibilityHint?: string;
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

const HEIGHT: Record<ButtonSize, number> = { sm: 40, md: 48, lg: 54 };
const PADDING: Record<ButtonSize, number> = { sm: 14, md: 18, lg: 22 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  accessibilityHint,
  testID,
  style,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const palette = {
    primary: { bg: colors.accent, fg: colors.onAccent, border: colors.accent },
    secondary: { bg: colors.surfaceElevated, fg: colors.text, border: colors.border },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
    destructive: { bg: colors.dangerMuted, fg: colors.danger, border: colors.dangerMuted },
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityHint={accessibilityHint}
      testID={testID}
      style={[
        styles.base,
        {
          height: HEIGHT[size],
          paddingHorizontal: PADDING[size],
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: isDisabled ? opacity.disabled : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <View style={styles.content}>
          {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
          <Text
            variant={size === 'sm' ? 'label' : 'bodyStrong'}
            color={palette.fg}
            numberOfLines={1}
          >
            {label}
          </Text>
          {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 4,
  },
});

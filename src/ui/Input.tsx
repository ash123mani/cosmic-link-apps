import { forwardRef, useState, type ReactNode } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';

export interface InputProps extends TextInputProps {
  invalid?: boolean;
  leftAccessory?: ReactNode;
  rightAccessory?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    invalid = false,
    leftAccessory,
    rightAccessory,
    containerStyle,
    style,
    multiline,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = invalid
    ? colors.danger
    : focused
      ? colors.focusRing
      : colors.borderStrong;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor,
        },
        multiline && styles.multiline,
        containerStyle,
      ]}
    >
      {leftAccessory ? <View style={styles.accessory}>{leftAccessory}</View> : null}
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={colors.textTertiary}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          { color: colors.text },
          multiline && styles.multilineInput,
          style,
        ]}
        {...rest}
      />
      {rightAccessory ? <View style={styles.accessory}>{rightAccessory}</View> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.control,
    paddingHorizontal: 14,
  },
  multiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  multilineInput: {
    minHeight: 84,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
  accessory: {
    marginHorizontal: 6,
  },
});

import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { Text } from './Text';

export interface FieldProps {
  label?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Field({ label, helper, error, required, children, style }: FieldProps) {
  const { colors } = useTheme();
  const message = error || helper;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <Text variant="label" tone="textSecondary" style={styles.label}>
          {label}
          {required ? <Text variant="label" tone="danger"> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {message ? (
        <Text
          variant="caption"
          color={error ? colors.danger : colors.textTertiary}
          style={styles.message}
          accessibilityLiveRegion={error ? 'polite' : 'none'}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  message: {
    marginTop: 6,
  },
});

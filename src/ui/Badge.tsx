import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Text } from './Text';

export interface BadgeProps {
  label: string;
  tone?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral';
}

export function Badge({ label, tone = 'accent' }: BadgeProps) {
  const { colors } = useTheme();

  const map = {
    accent: { bg: colors.accentMuted, fg: colors.accent },
    success: { bg: colors.successMuted, fg: colors.success },
    warning: { bg: colors.warningMuted, fg: colors.warning },
    danger: { bg: colors.dangerMuted, fg: colors.danger },
    neutral: { bg: colors.surfaceElevated, fg: colors.textSecondary },
  }[tone];

  return (
    <View style={[styles.base, { backgroundColor: map.bg }]}>
      <Text variant="caption" color={map.fg}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

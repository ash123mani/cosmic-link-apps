import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';
import { Text } from './Text';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: ReactNode;
  count?: number;
  accessibilityLabel?: string;
}

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  count,
  accessibilityLabel,
}: ChipProps) {
  const { colors } = useTheme();

  const content = (
    <View style={styles.content}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <Text
        variant="label"
        color={selected ? colors.accent : colors.text}
        numberOfLines={1}
      >
        {label}
      </Text>
      {typeof count === 'number' ? (
        <Text
          variant="caption"
          color={selected ? colors.accent : colors.textSecondary}
          style={styles.count}
        >
          {count}
        </Text>
      ) : null}
    </View>
  );

  const baseStyle = [
    styles.base,
    {
      backgroundColor: selected ? colors.accentMuted : colors.surface,
      borderColor: selected ? colors.accent : colors.borderStrong,
    },
  ];

  if (!onPress) {
    return <View style={baseStyle}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      haptic="selection"
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel ?? label}
      style={baseStyle}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  count: {
    marginLeft: 6,
  },
});

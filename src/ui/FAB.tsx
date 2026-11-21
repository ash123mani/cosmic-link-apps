import { StyleSheet, type ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';

export interface FABProps {
  onPress: () => void;
  accessibilityLabel?: string;
  icon?: 'add' | 'link';
  style?: ViewStyle;
}

export function FAB({ onPress, accessibilityLabel = 'Add link', icon = 'add', style }: FABProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      haptic="medium"
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.base,
        {
          backgroundColor: colors.accent,
          shadowColor: colors.accent,
        },
        style,
      ]}
    >
      <MaterialIcons name={icon} size={28} color={colors.onAccent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
});

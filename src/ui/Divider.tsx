import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/src/theme/ThemeProvider';

export function Divider({ style }: { style?: ViewStyle }) {
  const { colors } = useTheme();
  return <View style={[styles.base, { backgroundColor: colors.border }, style]} />;
}

const styles = StyleSheet.create({
  base: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
});

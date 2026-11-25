import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Input } from './Input';
import { Pressable } from './Pressable';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search', onClear, autoFocus }: Props) {
  const { colors } = useTheme();
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };
  return (
    <View style={[styles.wrap, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
      <MaterialIcons name="search" size={20} color={colors.textTertiary} />
      <View style={styles.inputWrap}>
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
          clearButtonMode="while-editing"
          containerStyle={styles.inputContainer}
          style={styles.input}
          accessibilityLabel={placeholder}
        />
      </View>
      {value.length > 0 ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8} style={styles.clear} onPress={handleClear}>
          <MaterialIcons name="cancel" size={18} color={colors.textTertiary} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: radius.control, paddingHorizontal: 12, minHeight: 48, borderWidth: 1 },
  inputWrap: { flex: 1 },
  inputContainer: { marginBottom: 0, borderWidth: 0, backgroundColor: 'transparent', minHeight: 44 },
  input: { paddingHorizontal: 0 },
  clear: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});

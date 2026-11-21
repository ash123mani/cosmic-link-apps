import { forwardRef } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';

export interface SearchBarProps extends TextInputProps {
  onClear?: () => void;
}

export const SearchBar = forwardRef<TextInput, SearchBarProps>(function SearchBar(
  { value, onClear, style, ...rest },
  ref,
) {
  const { colors } = useTheme();
  const hasValue = !!value;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
      ]}
    >
      <MaterialIcons name="search" size={20} color={colors.textTertiary} />
      <TextInput
        ref={ref}
        value={value}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.text }, style]}
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="Search links"
        {...rest}
      />
      {hasValue ? (
        <Pressable
          onPress={onClear}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <MaterialIcons name="cancel" size={18} color={colors.textTertiary} />
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
});

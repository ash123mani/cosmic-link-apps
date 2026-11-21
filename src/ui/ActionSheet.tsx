import { type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';
import { Sheet } from './Sheet';
import { Text } from './Text';
import { Divider } from './Divider';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface ActionSheetItem {
  label: string;
  icon?: IconName;
  destructive?: boolean;
  onPress: () => void;
}

export interface ActionSheetProps {
  visible: boolean;
  title?: string;
  items: ActionSheetItem[];
  onClose: () => void;
  cancelLabel?: string;
}

export function ActionSheet({
  visible,
  title,
  items,
  onClose,
  cancelLabel = 'Cancel',
}: ActionSheetProps) {
  const { colors } = useTheme();

  return (
    <Sheet visible={visible} onClose={onClose} title={title} scrollable={false}>
      <View>
        {items.map((item, index) => (
          <View key={item.label}>
            {index > 0 ? <Divider /> : null}
            <Pressable
              onPress={() => {
                onClose();
                item.onPress();
              }}
              haptic="selection"
              accessibilityRole="button"
              style={styles.row}
            >
              {item.icon ? (
                <MaterialIcons
                  name={item.icon}
                  size={20}
                  color={item.destructive ? colors.danger : colors.textSecondary}
                />
              ) : null}
              <Text
                variant="body"
                color={item.destructive ? colors.danger : colors.text}
                style={styles.label}
              >
                {item.label}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Pressable
        onPress={onClose}
        haptic="light"
        accessibilityRole="button"
        style={[styles.cancel, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
      >
        <Text variant="bodyStrong">{cancelLabel}</Text>
      </Pressable>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 52,
    paddingVertical: 12,
  },
  label: {
    flex: 1,
  },
  cancel: {
    marginTop: 16,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
  },
});

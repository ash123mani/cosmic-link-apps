import { Modal, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ActionSheetAction = {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
};

export type ActionSheetItem = ActionSheetAction;

type Props = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  actions?: ActionSheetAction[];
  items?: ActionSheetAction[];
};

export function ActionSheet({ visible, title, onClose, actions, items }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const list = actions ?? items ?? [];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={onClose} accessibilityLabel="Close action sheet">
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}
          onPress={() => {}}
        >
          <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
          {title ? <Text variant="caption" tone="textSecondary" align="center" style={styles.title}>{title}</Text> : null}
          {list.map((action, index) => (
            <Pressable
              key={`${action.label}-${index}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: action.disabled }}
              disabled={action.disabled}
              style={[styles.action, index < list.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }, action.disabled && styles.disabled]}
              onPress={() => {
                if (action.disabled) return;
                onClose();
                action.onPress();
              }}
            >
              <Text
                variant="bodyStrong"
                color={action.disabled ? colors.textTertiary : action.destructive ? colors.danger : colors.text}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" style={[styles.cancel, { backgroundColor: colors.surfaceSunken, borderColor: colors.border }]} onPress={onClose}>
            <Text variant="bodyStrong">Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end' },
  sheet: { paddingHorizontal: 16, paddingTop: 10, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderWidth: 1 },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, marginBottom: 8 },
  title: { paddingVertical: 10, paddingHorizontal: 8 },
  action: { minHeight: 52, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  disabled: { opacity: 0.45 },
  cancel: { minHeight: 48, borderRadius: radius.control, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderWidth: 1 },
});

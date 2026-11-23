import { Modal, StyleSheet, View } from 'react-native';
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
  const list = actions ?? items ?? [];
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close action sheet">
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => {}}>
          {title ? <Text variant="caption" tone="textSecondary" align="center" style={styles.title}>{title}</Text> : null}
          {list.map((action) => (
            <Pressable
              key={action.label}
              accessibilityRole="button"
              accessibilityState={{ disabled: action.disabled }}
              disabled={action.disabled}
              style={[styles.action, { backgroundColor: colors.surfaceElevated }, action.disabled && styles.disabled]}
              onPress={() => {
                if (action.disabled) return;
                onClose();
                action.onPress();
              }}
            >
              <Text
                variant="body"
                color={action.disabled ? colors.textTertiary : action.destructive ? colors.danger : colors.text}
              >
                {action.label}
              </Text>
            </Pressable>
          ))}
          <Pressable accessibilityRole="button" style={[styles.cancel, { backgroundColor: colors.surfaceSunken }]} onPress={onClose}>
            <Text variant="bodyStrong">Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { padding: 16, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, borderWidth: 1, gap: 8 },
  title: { paddingVertical: 8 },
  action: { minHeight: 48, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  disabled: { opacity: 0.45 },
  cancel: { minHeight: 48, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
});

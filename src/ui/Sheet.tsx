import { type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Text } from './Text';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  scrollable?: boolean;
  dismissable?: boolean;
}

export function Sheet({
  visible,
  onClose,
  title,
  children,
  scrollable = true,
  dismissable = true,
}: SheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]}
          onPress={dismissable ? onClose : undefined}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}
        >
          <Animated.View
            entering={SlideInDown.duration(260)}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
            {title ? (
              <View style={styles.header}>
                <Text variant="title3" style={styles.headerTitle}>
                  {title}
                </Text>
                <Pressable
                  onPress={onClose}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <MaterialIcons name="close" size={22} color={colors.textSecondary} />
                </Pressable>
              </View>
            ) : null}
            {scrollable ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={styles.content}>{children}</View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// Re-exported so callers can keep the animated backdrop semantics.
export { FadeIn };

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboard: {
    width: '100%',
  },
  sheet: {
    maxHeight: '90%',
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
  },
  content: {
    paddingBottom: 8,
  },
});

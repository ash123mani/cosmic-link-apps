import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Pressable } from './Pressable';
import { Text } from './Text';

export type ToastTone = 'default' | 'success' | 'danger';

export interface ToastOptions {
  message: string;
  tone?: ToastTone;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
}

interface ToastState extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  const clearTimer = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const showToast = useCallback(
    (options: ToastOptions) => {
      clearTimer();
      counter.current += 1;
      setToast({ ...options, id: counter.current });
      timer.current = setTimeout(() => setToast(null), options.duration ?? 3500);
    },
    [clearTimer],
  );

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <Animated.View
          key={toast.id}
          entering={FadeInDown.duration(200)}
          exiting={FadeOutDown.duration(160)}
          style={[
            styles.toast,
            {
              bottom: insets.bottom + 88,
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessible
        >
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  toast.tone === 'success'
                    ? colors.success
                    : toast.tone === 'danger'
                      ? colors.danger
                      : colors.accent,
              },
            ]}
          />
          <Text variant="bodySm" style={styles.message} numberOfLines={3}>
            {toast.message}
          </Text>
          {toast.actionLabel && toast.onAction ? (
            <Pressable
              haptic="selection"
              accessibilityRole="button"
              onPress={() => {
                toast.onAction?.();
                hideToast();
              }}
              style={styles.action}
            >
              <Text variant="label" tone="accent">
                {toast.actionLabel}
              </Text>
            </Pressable>
          ) : null}
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.sm,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  message: {
    flex: 1,
  },
  action: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});

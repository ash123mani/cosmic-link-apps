import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/src/api/client';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { Button, Field, IconButton, Input, Text, useToast } from '@/src/ui';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{ token?: string | string[] }>();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [confirmError, setConfirmError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) return;

    let valid = true;
    if (password.length < 6) {
      setPasswordError('Use at least 6 characters');
      valid = false;
    }
    if (confirm !== password) {
      setConfirmError('Passwords do not match');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      await api(`/api/v1/auth/resetpassword/${encodeURIComponent(token)}`, {
        method: 'PUT',
        body: { password },
      });
      showToast({ message: 'Password updated — please sign in', tone: 'success' });
      router.replace('/(auth)/login');
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setPasswordError(message || 'This reset link may have expired');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <MaterialIcons name="link-off" size={40} color={colors.textTertiary} />
        <Text variant="title2" style={styles.centeredText}>
          Invalid reset link
        </Text>
        <Text variant="bodySm" tone="textSecondary" style={styles.centeredText}>
          This link is missing a token. Request a new password reset email.
        </Text>
        <Button
          label="Back to login"
          onPress={() => router.replace('/(auth)/login')}
          style={styles.action}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.topBar}>
        <IconButton
          icon={<MaterialIcons name="arrow-back" size={24} color={colors.text} />}
          accessibilityLabel="Go back"
          variant="surface"
          onPress={() => router.replace('/(auth)/login')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text variant="overline" tone="accent">
            New credentials
          </Text>
          <Text variant="title1" style={styles.title}>
            Set a new password
          </Text>
          <Text variant="bodySm" tone="textSecondary" style={styles.subtitle}>
            Choose a password you haven&apos;t used before. You&apos;ll sign in with it next time.
          </Text>

          <Field label="New password" required error={passwordError}>
            <Input
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (passwordError) setPasswordError(undefined);
              }}
              placeholder="At least 6 characters"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              invalid={!!passwordError}
              rightAccessory={
                <IconButton
                  icon={
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={20}
                      color={colors.textTertiary}
                    />
                  }
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  size={32}
                  onPress={() => setShowPassword((value) => !value)}
                />
              }
            />
          </Field>

          <Field label="Confirm password" required error={confirmError}>
            <Input
              value={confirm}
              onChangeText={(value) => {
                setConfirm(value);
                if (confirmError) setConfirmError(undefined);
              }}
              placeholder="Re-enter your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              invalid={!!confirmError}
              returnKeyType="done"
              onSubmitEditing={() => void handleReset()}
            />
          </Field>

          <Button label="Update password" onPress={() => void handleReset()} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
    gap: spacing[2],
  },
  centeredText: {
    textAlign: 'center',
  },
  action: {
    marginTop: spacing[4],
  },
  topBar: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing[4],
  },
  card: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },
  title: {
    marginTop: 6,
    marginBottom: spacing[2],
  },
  subtitle: {
    marginBottom: spacing[5],
    lineHeight: 20,
  },
});

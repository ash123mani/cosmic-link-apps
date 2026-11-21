import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/src/api/client';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { Button, Field, IconButton, Input, Text } from '@/src/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setError('Enter a valid email address');
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      await api('/api/v1/auth/forgotpassword', {
        method: 'POST',
        body: { email: trimmed },
      });
      setSent(true);
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setError(message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

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
          onPress={() => router.back()}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {sent ? (
            <View style={styles.sentWrap}>
              <View style={[styles.iconCircle, { backgroundColor: colors.accentMuted }]}>
                <MaterialIcons name="mark-email-read" size={28} color={colors.accent} />
              </View>
              <Text variant="title1" style={styles.centered}>
                Check your inbox
              </Text>
              <Text variant="bodySm" tone="textSecondary" style={styles.centered}>
                If an account exists for {email.trim()}, we&apos;ve sent a link to reset your
                password. It expires in 10 minutes.
              </Text>
              <Button
                label="Back to login"
                onPress={() => router.replace('/(auth)/login')}
                style={styles.primaryAction}
              />
            </View>
          ) : (
            <>
              <Text variant="overline" tone="accent">
                Account recovery
              </Text>
              <Text variant="title1" style={styles.title}>
                Reset password
              </Text>
              <Text variant="bodySm" tone="textSecondary" style={styles.subtitle}>
                Enter the email linked to your account and we&apos;ll send you a reset link.
              </Text>

              <Field label="Email" required error={error}>
                <Input
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (error) setError(undefined);
                  }}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  autoComplete="email"
                  returnKeyType="send"
                  onSubmitEditing={() => void handleReset()}
                  invalid={!!error}
                />
              </Field>

              <Button
                label="Send reset link"
                onPress={() => void handleReset()}
                loading={loading}
                leftIcon={<MaterialIcons name="send" size={18} color={colors.onAccent} />}
              />

              <Button
                label="Back to login"
                variant="ghost"
                onPress={() => router.back()}
                style={styles.secondaryAction}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  primaryAction: {
    marginTop: spacing[5],
  },
  secondaryAction: {
    marginTop: spacing[2],
  },
  sentWrap: {
    alignItems: 'stretch',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.full ?? 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing[4],
  },
  centered: {
    textAlign: 'center',
    marginBottom: spacing[3],
    lineHeight: 22,
  },
});

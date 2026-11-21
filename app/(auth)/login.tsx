import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Link, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { Button, Field, IconButton, Input, Text } from '@/src/ui';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    let valid = true;
    setFormError(undefined);

    if (!EMAIL_RE.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }
    if (!password) {
      setPasswordError('Enter your password');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      await login(trimmedEmail, password);
      router.replace('/(tabs)/links');
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setFormError(message || 'Could not sign in. Please try again.');
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
          <Text variant="overline" tone="accent">
            Welcome back
          </Text>
          <Text variant="title1" style={styles.title}>
            Sign in
          </Text>
          <Text variant="bodySm" tone="textSecondary" style={styles.subtitle}>
            Access your saved links from anywhere.
          </Text>

          {formError ? (
            <View style={[styles.formError, { backgroundColor: colors.dangerMuted }]}>
              <MaterialIcons name="error-outline" size={18} color={colors.danger} />
              <Text variant="bodySm" color={colors.danger} style={styles.formErrorText}>
                {formError}
              </Text>
            </View>
          ) : null}

          <Field label="Email" required error={emailError}>
            <Input
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (emailError) setEmailError(undefined);
                if (formError) setFormError(undefined);
              }}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              autoComplete="email"
              invalid={!!emailError}
            />
          </Field>

          <Field label="Password" required error={passwordError}>
            <Input
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (passwordError) setPasswordError(undefined);
                if (formError) setFormError(undefined);
              }}
              placeholder="Your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              autoComplete="password"
              invalid={!!passwordError}
              returnKeyType="done"
              onSubmitEditing={() => void handleLogin()}
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

          <Link href="/(auth)/forgot-password" asChild>
            <Text
              variant="label"
              tone="accent"
              style={styles.forgotLink}
              accessibilityRole="link"
            >
              Forgot password?
            </Text>
          </Link>

          <Button label="Sign in" onPress={() => void handleLogin()} loading={loading} />

          <View style={styles.footer}>
            <Text variant="bodySm" tone="textSecondary">
              Don&apos;t have an account?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <Text variant="bodyStrong" tone="accent" accessibilityRole="link">
                Create one
              </Text>
            </Link>
          </View>
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
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: 12,
    marginBottom: spacing[4],
  },
  formErrorText: {
    flex: 1,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginTop: -6,
    marginBottom: spacing[5],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[5],
  },
});

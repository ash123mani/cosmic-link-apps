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

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    let valid = true;
    setFormError(undefined);

    if (trimmedUsername.length < 2) {
      setUsernameError('Choose a username (at least 2 characters)');
      valid = false;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setEmailError('Enter a valid email address');
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError('Use at least 6 characters');
      valid = false;
    }
    if (!valid) return;

    setLoading(true);
    try {
      await register(trimmedUsername, trimmedEmail, password);
      router.replace('/(tabs)/links');
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setFormError(message || 'Could not create your account. Please try again.');
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
            Get started
          </Text>
          <Text variant="title1" style={styles.title}>
            Create your account
          </Text>
          <Text variant="bodySm" tone="textSecondary" style={styles.subtitle}>
            Save, organise and rediscover your favourite links.
          </Text>

          {formError ? (
            <View style={[styles.formError, { backgroundColor: colors.dangerMuted }]}>
              <MaterialIcons name="error-outline" size={18} color={colors.danger} />
              <Text variant="bodySm" color={colors.danger} style={styles.formErrorText}>
                {formError}
              </Text>
            </View>
          ) : null}

          <Field label="Username" required error={usernameError}>
            <Input
              value={username}
              onChangeText={(value) => {
                setUsername(value);
                if (usernameError) setUsernameError(undefined);
                if (formError) setFormError(undefined);
              }}
              placeholder="What should we call you?"
              autoCapitalize="words"
              autoCorrect={false}
              textContentType="username"
              autoComplete="username"
              invalid={!!usernameError}
            />
          </Field>

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
              placeholder="At least 6 characters"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              autoComplete="new-password"
              invalid={!!passwordError}
              returnKeyType="done"
              onSubmitEditing={() => void handleRegister()}
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

          <Button
            label="Create account"
            onPress={() => void handleRegister()}
            loading={loading}
            style={styles.submit}
          />

          <View style={styles.footer}>
            <Text variant="bodySm" tone="textSecondary">
              Already have an account?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <Text variant="bodyStrong" tone="accent" accessibilityRole="link">
                Sign in
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
  submit: {
    marginTop: spacing[2],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing[5],
  },
});

import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Info', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error('Failed to send reset email');
      setSent(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.message}>
            If an account exists with that email, we've sent a password reset link.
          </Text>
          <Link href="/(auth)/login" style={styles.link}>Back to Login</Link>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.message}>Enter your email to receive a reset link</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={Colors.gray}
        />

        <Pressable style={styles.button} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
        </Pressable>

        <Link href="/(auth)/login" style={styles.link}>Back to Login</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.blackMedium, textAlign: 'center', marginBottom: Spacing.sm + Spacing.xs },
  message: { fontSize: FontSize.md, color: Colors.gray, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
  input: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    fontSize: FontSize.md,
    color: Colors.blackMedium,
    marginBottom: Spacing.md,
    ...Shadow.input,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
  link: { color: Colors.primary, fontWeight: '600', textAlign: 'center', marginTop: Spacing.md, fontSize: FontSize.sm },
});

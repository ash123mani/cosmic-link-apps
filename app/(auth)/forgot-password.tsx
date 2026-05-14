import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSize, FontFamily } from '@/constants/theme';
import { CosmicCard } from '@/src/components/CosmicCard';
import { PressableScale } from '@/src/components/PressableScale';

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
        <CosmicCard style={{ marginHorizontal: Spacing.lg }}>
          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.message}>
            If an account exists with that email, we've sent a password reset link.
          </Text>
          <Link href="/(auth)/login" style={styles.link}>Back to Login</Link>
        </CosmicCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CosmicCard style={{ marginHorizontal: Spacing.lg }}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.message}>Enter your email to receive a reset link</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={Colors.textMuted}
        />

        <PressableScale style={styles.button} onPress={handleReset} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="send" size={18} color={Colors.white} />
              <Text style={styles.buttonText}>Send Reset Link</Text>
            </View>
          )}
        </PressableScale>

        <Link href="/(auth)/login" style={styles.link}>Back to Login</Link>
      </CosmicCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center' },
  title: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text, textAlign: 'center', marginBottom: Spacing.md },
  message: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 22 },
  input: {
    fontFamily: FontFamily,
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
  link: { color: Colors.text, fontWeight: '600', textAlign: 'center', marginTop: Spacing.md, fontSize: FontSize.sm, textDecorationLine: 'underline' },
});

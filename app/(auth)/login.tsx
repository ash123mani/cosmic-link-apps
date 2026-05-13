import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Info', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)/links');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={Colors.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={Colors.gray}
        />

        <Link href="/(auth)/forgot-password" style={styles.link}>Forgot Password?</Link>

        <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Login</Text>}
        </Pressable>

        <Text style={styles.footerText}>
          Don't have an account? <Link href="/(auth)/register" style={styles.link}>Register</Link>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.blackMedium, marginBottom: Spacing.xs, textAlign: 'center' },
  subtitle: { fontSize: FontSize.lg, color: Colors.gray, textAlign: 'center', marginBottom: Spacing.xl },
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
    marginTop: Spacing.sm,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
  link: { color: Colors.primary, fontWeight: '600', textAlign: 'center', marginTop: Spacing.md, fontSize: FontSize.sm },
  footerText: { color: Colors.gray, fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.md },
});

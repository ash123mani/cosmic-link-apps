import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router, Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, BorderRadius, Spacing, FontSize, FontFamily } from '@/constants/theme';
import { CosmicCard } from '@/src/components/CosmicCard';
import { PressableScale } from '@/src/components/PressableScale';

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
      <PressableScale onPress={() => router.back()} style={styles.backBtn}>
        <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
      </PressableScale>
      <CosmicCard style={{ marginHorizontal: Spacing.lg }}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholderTextColor={Colors.textMuted}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={Colors.textMuted}
        />

        <Link href="/(auth)/forgot-password" style={styles.link}>Forgot Password?</Link>

        <PressableScale style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialIcons name="login" size={20} color={Colors.white} />
              <Text style={styles.buttonText}>Login</Text>
            </View>
          )}
        </PressableScale>

        <Text style={styles.footerText}>
          Don't have an account? <Link href="/(auth)/register" style={styles.link}>Register</Link>
        </Text>
      </CosmicCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, justifyContent: 'center' },
  backBtn: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 10,
  },
  header: { alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
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
    marginTop: Spacing.md,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
  link: { color: Colors.text, fontWeight: '600', textAlign: 'center', marginTop: Spacing.md, fontSize: FontSize.sm, textDecorationLine: 'underline' },
  footerText: { color: Colors.textSecondary, fontSize: FontSize.sm, textAlign: 'center', marginTop: Spacing.lg },
});

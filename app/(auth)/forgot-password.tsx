import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
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
            We've sent a password reset link to {email}. Please check your inbox.
          </Text>
          <Pressable style={styles.button} onPress={() => router.replace('/(auth)/login' as any)}>
            <Text style={styles.buttonText}>Back to Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.message}>Enter your email and we'll send you a reset link.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          placeholderTextColor={Colors.gray}
        />

        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.link}>Back to Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  content: { flex: 1, justifyContent: 'center', padding: 32 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.blackMedium, textAlign: 'center', marginBottom: 12 },
  message: { fontSize: 15,  color: Colors.gray, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    padding: 16,
    fontSize: 15,
    
    marginBottom: 16,
    color: Colors.blackMedium,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
  link: { color: Colors.primary, fontWeight: '600', textAlign: 'center', marginTop: 20, fontSize: 14 },
});

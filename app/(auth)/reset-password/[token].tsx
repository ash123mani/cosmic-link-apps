import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Password Reset!</Text>
          <Text style={styles.message}>Your password has been successfully reset.</Text>
          <Pressable style={styles.button} onPress={() => router.replace('/(auth)/login' as any)}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.message}>Enter your new password.</Text>

        <TextInput
          style={styles.input}
          placeholder="New password (min 6 chars)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={Colors.gray}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={Colors.gray}
        />

        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.buttonText}>Reset Password</Text>}
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
    
    marginBottom: 12,
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
    marginTop: 8,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});

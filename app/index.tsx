import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router, Redirect } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';

export default function LandingScreen() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href="/(tabs)/links" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('@/assets/cosmic-link-logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.appName}>Cosmic Link</Text>
        <Text style={styles.tagline}>All your URLs, stored in one place.</Text>
        <Text style={styles.description}>
          Save, organize, and access all your important links from anywhere. The simplest way to keep your digital life in order.
        </Text>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryButtonText}>Login</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryButtonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  logo: { width: 100, height: 100, marginBottom: Spacing.md },
  appName: { fontSize: FontSize.display, fontWeight: '700', color: Colors.primary, textAlign: 'center' },
  tagline: { fontSize: FontSize.lg, color: Colors.gray, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
  description: { fontSize: FontSize.sm, color: Colors.gray, textAlign: 'center', lineHeight: 22, marginBottom: 48, paddingHorizontal: Spacing.md },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.sm + Spacing.xs,
  },
  primaryButtonText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  secondaryButtonText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.lg },
});

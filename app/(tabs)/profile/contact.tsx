import { View, Text, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';
import { CosmicCard } from '@/src/components/CosmicCard';
import { PressableScale } from '@/src/components/PressableScale';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <PressableScale style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </PressableScale>
        <Text style={styles.title}>Contact Us</Text>
      </View>
      <CosmicCard style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialIcons name="mail-outline" size={32} color={Colors.primary} />
        </View>
        <Text style={styles.heading}>Get in Touch</Text>
        <Text style={styles.body}>
          For any support, feedback, or queries, reach out to us at:
        </Text>
        <PressableScale style={styles.emailRow} onPress={() => Linking.openURL('mailto:copycutsave@gmail.com')}>
          <MaterialIcons name="email" size={20} color={Colors.primary} />
          <Text style={styles.email}>copycutsave@gmail.com</Text>
        </PressableScale>
        <Text style={styles.body}>We'll get back to you as soon as possible.</Text>
      </CosmicCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text, flex: 1 },
  card: {
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
  },
  body: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgLight,
    paddingVertical: Spacing.sm + 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  email: {
    fontSize: FontSize.lg,
    color: Colors.primary,
    fontWeight: '600',
  },
});

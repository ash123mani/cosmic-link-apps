import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, Spacing, FontSize } from '@/constants/theme';
import { CosmicCard } from '@/src/components/CosmicCard';
import { PressableScale } from '@/src/components/PressableScale';

export default function ProfileInfoScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <PressableScale style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </PressableScale>
        <Text style={styles.title}>Personal Info</Text>
      </View>

      <CosmicCard style={{ marginHorizontal: Spacing.md }}>
        <View style={styles.avatarCircle}>
          <MaterialIcons name="person" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.name}>{user?.name || '-'}</Text>
        <View style={styles.divider} />
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || '-'}</Text>
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
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  label: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.xs },
  value: { fontSize: FontSize.lg, color: Colors.text, fontWeight: '600', marginBottom: Spacing.md },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.md },
});

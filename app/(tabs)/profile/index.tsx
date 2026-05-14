import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';
import { CosmicCard } from '@/src/components/CosmicCard';
import { PressableScale } from '@/src/components/PressableScale';

export default function ProfileIndexScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <CosmicCard padding={0} style={{ marginHorizontal: Spacing.md }}>
        <PressableScale style={styles.menuRow} onPress={() => router.push('/(tabs)/profile/categories')}>
          <View style={styles.menuLeft}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="folder" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Manage Categories</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
        </PressableScale>

        <View style={styles.divider} />

        <PressableScale style={styles.menuRow} onPress={() => router.push('/(tabs)/profile/info')}>
          <View style={styles.menuLeft}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="person" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Personal Info</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
        </PressableScale>

        <View style={styles.divider} />

        <PressableScale style={styles.menuRow} onPress={() => router.push('/(tabs)/profile/contact')}>
          <View style={styles.menuLeft}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="mail" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.menuLabel}>Contact Us</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
        </PressableScale>
      </CosmicCard>

      <PressableScale style={styles.logoutBtn} onPress={() => { logout(); router.replace('/'); }}>
        <MaterialIcons name="logout" size={20} color={Colors.error} />
        <Text style={styles.logoutText}>  Logout</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: FontSize.lg },
});

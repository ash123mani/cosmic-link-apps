import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';

export default function ProfileIndexScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.menu}>
        <Pressable style={styles.menuRow} onPress={() => router.push('/(tabs)/profile/info')}>
          <View style={styles.menuLeft}>
            <MaterialIcons name="person-outline" size={22} color={Colors.blackMedium} />
            <Text style={styles.menuLabel}>Personal Info</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.gray} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable style={styles.menuRow} onPress={() => router.push('/(tabs)/profile/categories')}>
          <View style={styles.menuLeft}>
            <MaterialIcons name="folder-outline" size={22} color={Colors.blackMedium} />
            <Text style={styles.menuLabel}>Categories</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.gray} />
        </Pressable>
      </View>

      <Pressable style={styles.logoutBtn} onPress={() => { logout(); router.replace('/'); }}>
        <MaterialIcons name="logout" size={20} color={Colors.white} />
        <Text style={styles.logoutText}>  Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.blackMedium },
  menu: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    ...Shadow.sm,
  },
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
  menuLabel: {
    fontSize: FontSize.lg,
    color: Colors.blackMedium,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.blackLight,
    marginHorizontal: Spacing.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.error,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  logoutText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
});

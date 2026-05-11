import { View, Text, StyleSheet, Pressable, FlatList, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login' as any);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user?.username}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories ({user?.categories?.length || 0})</Text>
        <FlatList
          data={user?.categories || []}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.categoryRow}>
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>
          )}
          scrollEnabled={false}
        />
      </View>

      <Pressable style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.blackMedium },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.gray, marginBottom: 8, textTransform: 'uppercase' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  divider: { height: 1, backgroundColor: Colors.bodyBg, marginHorizontal: 16 },
  label: { fontSize: 15,  color: Colors.gray },
  value: { fontSize: 15, fontWeight: '600', color: Colors.blackMedium },
  categoryRow: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    padding: 16,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  categoryName: { fontSize: 15,  color: Colors.blackMedium },
  logoutBtn: {
    margin: 16,
    backgroundColor: Colors.error,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});

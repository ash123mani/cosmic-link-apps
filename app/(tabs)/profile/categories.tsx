import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/api/client';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';

export default function ProfileCategoriesScreen() {
  const { user, refreshUser } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete Category', `Delete "${name}" and all its links?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingId(id);
          try {
            await api(`/api/v1/user/category/${id}`, { method: 'DELETE', auth: true });
            await refreshUser();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete category');
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.blackMedium} />
        </Pressable>
        <Text style={styles.title}>Categories</Text>
      </View>

      <View style={styles.card}>
        {user?.categories?.length ? (
          user.categories.map((cat: any) => (
            <View key={cat.id}>
              <View style={styles.categoryRow}>
                <MaterialIcons name="folder" size={20} color={Colors.primary} />
                <Text style={styles.categoryName}>{cat.name}</Text>
                {deletingId === cat.id ? (
                  <ActivityIndicator size="small" color={Colors.error} />
                ) : (
                  <Pressable onPress={() => handleDelete(cat.id, cat.name)} hitSlop={8}>
                    <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                  </Pressable>
                )}
              </View>
              <View style={styles.divider} />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No categories yet</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.blackMedium, flex: 1 },
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    ...Shadow.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    padding: Spacing.md,
  },
  categoryName: {
    fontSize: FontSize.lg,
    color: Colors.blackMedium,
    flex: 1,
  },
  divider: { height: 1, backgroundColor: Colors.blackLight, marginLeft: Spacing.md + 28 + Spacing.sm + 4 },
  empty: { padding: Spacing.md, color: Colors.gray, fontSize: FontSize.sm, textAlign: 'center' },
});

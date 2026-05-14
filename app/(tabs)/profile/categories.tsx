import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { api } from '@/src/api/client';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';
import { CosmicCard } from '@/src/components/CosmicCard';
import { PressableScale } from '@/src/components/PressableScale';

export default function ProfileCategoriesScreen() {
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <PressableScale style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.text} />
        </PressableScale>
        <Text style={styles.title}>Categories</Text>
      </View>

      <CosmicCard style={{ marginHorizontal: Spacing.md }}>
        {user?.categories?.length ? (
          user.categories.map((cat: any) => (
            <View key={cat.id}>
              <View style={styles.categoryRow}>
                <View style={styles.folderIcon}>
                  <MaterialIcons name="folder" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.categoryName}>{cat.name}</Text>
                {deletingId === cat.id ? (
                  <ActivityIndicator size="small" color={Colors.error} />
                ) : (
                  <PressableScale onPress={() => handleDelete(cat.id, cat.name)} scaleIn={0.9}>
                    <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                  </PressableScale>
                )}
              </View>
              <View style={styles.divider} />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No categories yet</Text>
        )}
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
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    padding: Spacing.md,
  },
  folderIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: FontSize.lg,
    color: Colors.text,
    flex: 1,
  },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: Spacing.md + 32 + Spacing.sm + 4 },
  empty: { padding: Spacing.md, color: Colors.textMuted, fontSize: FontSize.sm, textAlign: 'center' },
});

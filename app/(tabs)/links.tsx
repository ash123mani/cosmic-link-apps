import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { LinksProvider, useLinks } from '@/src/context/LinksContext';
import { CategoryTabs } from '@/src/components/CategoryTabs';
import { LinkCard } from '@/src/components/LinkCard';
import { SkeletonCard } from '@/src/components/SkeletonCard';
import { AddCategoryModal } from '@/src/components/AddCategoryModal';
import { PressableScale } from '@/src/components/PressableScale';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

function LinksContent() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const { links, loading, selectedCategory, setSelectedCategory, addLink, deleteLink, addCategory } = useLinks();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const [addCatVisible, setAddCatVisible] = useState(false);

  useEffect(() => {
    if (user?.categories?.length && !selectedCategory) {
      const target = categoryId
        ? user.categories.find((c: any) => c.id === categoryId)
        : user.categories[0];
      if (target) setSelectedCategory(target);
    }
  }, [user?.categories]);

  useEffect(() => {
    if (categoryId && user?.categories) {
      const target = user.categories.find((c: any) => c.id === categoryId);
      if (target && target.id !== selectedCategory?.id) {
        setSelectedCategory(target);
      }
    }
  }, [categoryId]);

  const handleAddCategory = async (name: string) => {
    await addCategory(name);
    await refreshUser();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Links</Text>
        <View style={styles.headerActions}>
          <PressableScale style={styles.headerBtn} onPress={() => setAddCatVisible(true)}>
            <MaterialIcons name="create-new-folder" size={18} color={Colors.white} />
            <Text style={styles.headerBtnText}>Category</Text>
          </PressableScale>
          <PressableScale style={styles.headerBtn} onPress={() => router.push('/(tabs)/add-link')}>
            <MaterialIcons name="add-link" size={18} color={Colors.white} />
            <Text style={styles.headerBtnText}>Link</Text>
          </PressableScale>
        </View>
      </View>

      {user?.categories ? (
        <CategoryTabs
          categories={user.categories}
          selectedId={selectedCategory?.id || null}
          onSelect={setSelectedCategory}
        />
      ) : null}

      {loading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
        </View>
      ) : links.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="bookmark-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No links yet</Text>
          <Text style={styles.emptyText}>Tap + Link to add your first link.</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={links}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => <LinkCard link={item} onDelete={deleteLink} index={index} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <AddCategoryModal
        visible={addCatVisible}
        onClose={() => setAddCatVisible(false)}
        onSubmit={handleAddCategory}
      />
    </View>
  );
}

export default function LinksScreen() {
  return (
    <LinksProvider>
      <LinksContent />
    </LinksProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm + 6,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  headerBtnText: { color: Colors.white, fontWeight: '600', fontSize: FontSize.xs },
  skeletonContainer: { paddingTop: Spacing.sm },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },
});

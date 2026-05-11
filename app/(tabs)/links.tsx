import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { LinksProvider, useLinks } from '@/src/context/LinksContext';
import { CategoryTabs } from '@/src/components/CategoryTabs';
import { LinkCard } from '@/src/components/LinkCard';
import { AddLinkModal } from '@/src/components/AddLinkModal';
import { AddCategoryModal } from '@/src/components/AddCategoryModal';

function LinksContent() {
  const { user, refreshUser } = useAuth();
  const { links, loading, selectedCategory, setSelectedCategory, addLink, deleteLink, getLinkMeta, addCategory, deleteCategory } = useLinks();
  const [addLinkVisible, setAddLinkVisible] = useState(false);
  const [addCatVisible, setAddCatVisible] = useState(false);

  useEffect(() => {
    if (user?.categories?.length && !selectedCategory) {
      setSelectedCategory(user.categories[0]);
    }
  }, [user?.categories]);

  const handleAddLink = async (data: any) => {
    await addLink(data);
  };

  const handleDeleteLink = async (id: string) => {
    await deleteLink(id);
  };

  const handleAddCategory = async (name: string) => {
    await addCategory(name);
    await refreshUser();
  };

  const handleDeleteCategory = (catId: string) => {
    Alert.alert('Delete Category', 'Are you sure? Links in this category won\'t be deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(catId);
            await refreshUser();
          } catch {
            Alert.alert('Error', 'Failed to delete category');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Links</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerBtn} onPress={() => setAddCatVisible(true)}>
            <Text style={styles.headerBtnText}>+ Category</Text>
          </Pressable>
          <Pressable style={styles.headerBtn} onPress={() => setAddLinkVisible(true)}>
            <Text style={styles.headerBtnText}>+ Link</Text>
          </Pressable>
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
        <ActivityIndicator size="large" color="#1001D4" style={{ marginTop: 40 }} />
      ) : links.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No links yet</Text>
          <Text style={styles.emptyText}>Add your first link to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={links}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <LinkCard link={item} onDelete={handleDeleteLink} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <AddLinkModal
        visible={addLinkVisible}
        onClose={() => setAddLinkVisible(false)}
        categories={user?.categories || []}
        selectedCategory={selectedCategory}
        onSubmit={handleAddLink}
        onFetchMeta={getLinkMeta}
      />

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
  container: { flex: 1, backgroundColor: '#F5F4F9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2A2438' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    backgroundColor: '#1001D4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#2A2438', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center' },
});

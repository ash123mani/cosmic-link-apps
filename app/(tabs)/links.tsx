import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { LinksProvider, useLinks } from '@/src/context/LinksContext';
import { CategoryTabs } from '@/src/components/CategoryTabs';
import { LinkCard } from '@/src/components/LinkCard';
import { AddLinkModal } from '@/src/components/AddLinkModal';
import { AddCategoryModal } from '@/src/components/AddCategoryModal';
import { Colors } from '@/constants/theme';

function LinksContent() {
  const { user, refreshUser } = useAuth();
  const { links, loading, selectedCategory, setSelectedCategory, addLink, deleteLink, getLinkMeta, addCategory } = useLinks();
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
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
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
  container: { flex: 1, backgroundColor: Colors.bodyBg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.blackMedium },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
  },
  headerBtnText: { color: Colors.white, fontWeight: '600', fontSize: 13 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.blackMedium, marginBottom: 8 },
  emptyText: { fontSize: 14,  color: Colors.gray, textAlign: 'center' },
});

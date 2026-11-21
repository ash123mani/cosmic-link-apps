import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useAllLinksQuery } from '@/src/data/links';
import { spacing } from '@/src/theme/tokens';
import { ALL_CATEGORY, type Category } from '@/src/types';
import {
  CategoryTabs,
  EmptyState,
  ErrorState,
  LinkRow,
  LinkRowSkeleton,
  SearchBar,
  Text,
} from '@/src/ui';

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(ALL_CATEGORY);
  const deferredQuery = useDeferredValue(query);

  const linksQuery = useAllLinksQuery();
  const categories = user?.categories ?? [];

  const results = useMemo(() => {
    const term = deferredQuery.trim().toLowerCase();
    const data = linksQuery.data ?? [];

    return data.filter((link) => {
      if (
        selectedCategory.id !== ALL_CATEGORY.id &&
        link.category?.id !== selectedCategory.id
      ) {
        return false;
      }
      if (!term) return true;

      const haystack = [
        link.title,
        link.description,
        link.linkUrl,
        link.siteName,
        link.category?.name,
      ];
      return haystack.some((value) => value?.toLowerCase().includes(term));
    });
  }, [deferredQuery, linksQuery.data, selectedCategory.id]);

  const renderContent = () => {
    if (linksQuery.isLoading) {
      return (
        <View style={styles.skeletons}>
          {[0, 1, 2, 3, 4].map((key) => (
            <LinkRowSkeleton key={key} />
          ))}
        </View>
      );
    }

    if (linksQuery.isError) {
      return (
        <ErrorState
          title="Search is unavailable"
          description="We couldn't load your links to search. Please try again."
          onRetry={() => void linksQuery.refetch()}
        />
      );
    }

    if (!deferredQuery.trim() && selectedCategory.id === ALL_CATEGORY.id) {
      return (
        <EmptyState
          icon="search"
          title="Find anything you saved"
          description="Search across titles, descriptions, sites and URLs in your library."
        />
      );
    }

    if (results.length === 0) {
      return (
        <EmptyState
          icon="search-off"
          title="No matches"
          description="Try a different keyword or choose another category."
        />
      );
    }

    return (
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <LinkRow
            link={item}
            onPress={() => router.push(`/link/${item.id}`)}
            onMore={() => router.push(`/link/${item.id}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[2] }]}>
      <View style={styles.header}>
        <Text variant="title1">Search</Text>
        {deferredQuery.trim() ? (
          <Text variant="caption" tone="textTertiary">
            {results.length} {results.length === 1 ? 'result' : 'results'}
          </Text>
        ) : null}
      </View>

      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery('')}
          placeholder="Search your links"
        />
      </View>

      <CategoryTabs
        categories={categories}
        selectedId={selectedCategory.id}
        onSelect={setSelectedCategory}
        showAll
      />

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  searchWrap: {
    paddingHorizontal: spacing[4],
  },
  content: { flex: 1 },
  listContent: {
    paddingTop: spacing[1],
    paddingBottom: 40,
  },
  skeletons: {
    paddingTop: spacing[2],
  },
});

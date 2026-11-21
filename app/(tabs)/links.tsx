import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Share, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import {
  useAddLinkMutation,
  useAllLinkCounts,
  useAllLinksQuery,
  useDeleteLinkMutation,
  useLinksQuery,
  useUpdateLinkMutation,
} from '@/src/data/links';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { ALL_CATEGORY, type Category, type LinkItem } from '@/src/types';
import {
  ActionSheet,
  type ActionSheetItem,
  CategoryTabs,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  FAB,
  IconButton,
  LinkRow,
  LinkRowSkeleton,
  SendToUserSheet,
  Text,
  useToast,
} from '@/src/ui';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

  const [selectedCategory, setSelectedCategory] = useState<Category>(ALL_CATEGORY);
  const [actionLink, setActionLink] = useState<LinkItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LinkItem | null>(null);
  const [sendTarget, setSendTarget] = useState<LinkItem | null>(null);
  const [moveTarget, setMoveTarget] = useState<LinkItem | null>(null);

  const categories = useMemo<Category[]>(
    () => user?.categories ?? [],
    [user?.categories],
  );

  const linksQuery = useLinksQuery(selectedCategory.id);
  const { counts, total } = useAllLinkCounts();
  const deleteLink = useDeleteLinkMutation();
  const addLink = useAddLinkMutation();
  const updateLink = useUpdateLinkMutation();
  const allLinksQuery = useAllLinksQuery({ enabled: false });

  useEffect(() => {
    if (!categoryId) return;
    const match = categories.find((category) => category.id === categoryId);
    if (match) setSelectedCategory(match);
  }, [categoryId, categories]);

  useEffect(() => {
    if (selectedCategory.id !== ALL_CATEGORY.id) {
      const stillExists = categories.some((category) => category.id === selectedCategory.id);
      if (!stillExists) setSelectedCategory(ALL_CATEGORY);
    }
  }, [categories, selectedCategory.id]);

  const openLink = useCallback(async (link: LinkItem) => {
    try {
      await WebBrowser.openBrowserAsync(link.linkUrl);
    } catch {
      showToast({ message: 'Could not open this link', tone: 'danger' });
    }
  }, [showToast]);

  const copyLink = useCallback(async (link: LinkItem) => {
    await Clipboard.setStringAsync(link.linkUrl);
    showToast({ message: 'Link copied to clipboard', tone: 'success' });
  }, [showToast]);

  const shareLink = useCallback(async (link: LinkItem) => {
    try {
      await Share.share({ url: link.linkUrl, message: link.linkUrl });
    } catch {
      // User dismissed the share sheet.
    }
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);

    try {
      await deleteLink.mutateAsync(target.id);
      showToast({
        message: 'Link deleted',
        actionLabel: 'Undo',
        onAction: () => {
          // Undo re-saves the link. The original id cannot be restored client-side.
          addLink.mutate(
            {
              linkUrl: target.linkUrl,
              title: target.title,
              description: target.description,
              category: target.category,
              imageUrl: target.imageUrl,
              siteName: target.siteName,
            },
            {
              onSuccess: () => showToast({ message: 'Link restored', tone: 'success' }),
              onError: () => showToast({ message: 'Could not restore link', tone: 'danger' }),
            },
          );
        },
      });
    } catch {
      showToast({ message: 'Failed to delete link', tone: 'danger' });
    }
  }, [addLink, deleteLink, deleteTarget, showToast]);

  const actionItems = useMemo<ActionSheetItem[]>(() => {
    if (!actionLink) return [];
    return [
      { label: 'Open in browser', icon: 'open-in-new', onPress: () => void openLink(actionLink) },
      { label: 'Copy link', icon: 'content-copy', onPress: () => void copyLink(actionLink) },
      { label: 'Share link', icon: 'ios-share', onPress: () => void shareLink(actionLink) },
      { label: 'Send to user', icon: 'person-add-alt', onPress: () => setSendTarget(actionLink) },
      { label: 'Move to category', icon: 'drive-file-move-outline', onPress: () => setMoveTarget(actionLink) },
      {
        label: 'Edit details',
        icon: 'edit',
        onPress: () => router.push(`/link/${actionLink.id}`),
      },
      {
        label: 'Delete',
        icon: 'delete-outline',
        destructive: true,
        onPress: () => setDeleteTarget(actionLink),
      },
    ];
  }, [actionLink, openLink, copyLink, shareLink]);

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
          description="We couldn't load your links. Check your connection and try again."
          onRetry={() => void linksQuery.refetch()}
        />
      );
    }

    if (!linksQuery.data?.length) {
      return (
        <EmptyState
          icon="bookmark-outline"
          title="No links yet"
          description={
            selectedCategory.id === ALL_CATEGORY.id
              ? 'Save your first link and it will show up here.'
              : `Nothing in “${selectedCategory.name}” yet.`
          }
          actionLabel="Add your first link"
          onAction={() => router.push('/(tabs)/add-link')}
        />
      );
    }

    return (
      <FlatList
        data={linksQuery.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LinkRow
            link={item}
            showCategory={selectedCategory.id === ALL_CATEGORY.id}
            onPress={() => router.push(`/link/${item.id}`)}
            onLongPress={() => setActionLink(item)}
            onMore={() => setActionLink(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={linksQuery.isRefetching}
            onRefresh={() => {
              void linksQuery.refetch();
              void allLinksQuery.refetch();
            }}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[2] }]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text variant="overline" tone="textTertiary">
            Cosmic Link
          </Text>
          <Text variant="title1">Library</Text>
        </View>
        <IconButton
          icon={<MaterialIcons name="search" size={22} color={colors.text} />}
          accessibilityLabel="Search links"
          variant="surface"
          onPress={() => router.push('/(tabs)/search')}
        />
      </View>

      <CategoryTabs
        categories={categories}
        selectedId={selectedCategory.id}
        onSelect={setSelectedCategory}
        counts={counts}
        totalCount={total}
      />

      <View style={styles.content}>{renderContent()}</View>

      <FAB
        onPress={() => router.push('/(tabs)/add-link')}
        style={{
          position: 'absolute',
          right: spacing[4],
          bottom: insets.bottom + spacing[6],
        }}
      />

      <ActionSheet
        visible={!!actionLink}
        title={actionLink?.title}
        items={actionItems}
        onClose={() => setActionLink(null)}
      />

      <SendToUserSheet
        visible={!!sendTarget}
        link={sendTarget}
        onClose={() => setSendTarget(null)}
      />

      <ActionSheet
        visible={!!moveTarget}
        title={moveTarget ? `Move “${moveTarget.title}”` : 'Move to category'}
        items={(categories || [])
          .filter((c) => c.id !== moveTarget?.category?.id)
          .map((c) => ({
            label: c.name,
            icon: 'folder',
            onPress: async () => {
              if (!moveTarget) return;
              const target = moveTarget;
              setMoveTarget(null);
              try {
                await updateLink.mutateAsync({
                  id: target.id,
                  description: target.description || '',
                  category: c,
                });
                showToast({ message: `Moved to ${c.name}`, tone: 'success' });
              } catch {
                showToast({ message: 'Could not move link', tone: 'danger' });
              }
            },
          }))}
        onClose={() => setMoveTarget(null)}
      />

      <ConfirmDialog
        visible={!!deleteTarget}
        title="Delete link?"
        message={deleteTarget ? `“${deleteTarget.title}” will be removed from your library.` : undefined}
        confirmLabel="Delete"
        destructive
        loading={deleteLink.isPending}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  headerText: {
    gap: 2,
  },
  content: { flex: 1 },
  listContent: {
    paddingTop: spacing[1],
    paddingBottom: 140,
  },
  skeletons: {
    paddingTop: spacing[2],
  },
});

import { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useInboxQuery, useMarkSharesSeenMutation, useMoveShareMutation } from '@/src/data/shares';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { hostOf, isSharedCategory, type ShareItem } from '@/src/types';
import { ActionSheet, EmptyState, ErrorState, LinkRowSkeleton, Pressable, Text, useToast } from '@/src/ui';

function formatTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function SharedScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();
  const inbox = useInboxQuery();
  const markSeen = useMarkSharesSeenMutation();
  const moveShare = useMoveShareMutation();
  const [moveTarget, setMoveTarget] = useState<ShareItem | null>(null);

  const moveCategories = useMemo(
    () => (user?.categories ?? []).filter((c) => !isSharedCategory(c.id)),
    [user?.categories],
  );

  useFocusEffect(
    useCallback(() => {
      if ((inbox.data?.unseenCount ?? 0) > 0 && !markSeen.isPending) {
        markSeen.mutate({ all: true });
      }
    }, [inbox.data?.unseenCount, markSeen]),
  );

  const handlePress = async (share: ShareItem) => {
    if (share.status === 'unseen') markSeen.mutate({ ids: [share.id] });
    if (share.savedLinkId) { router.push(`/link/${share.savedLinkId}`); return; }
    try { await WebBrowser.openBrowserAsync(share.linkUrl); } catch {}
  };

  const renderItem = ({ item }: { item: ShareItem }) => {
    const title = item.title || hostOf(item.linkUrl) || 'Shared link';
    const unseen = item.status === 'unseen';
    return (
      <Pressable onPress={() => void handlePress(item)} haptic="light" accessibilityRole="button" style={[styles.card, { backgroundColor: colors.surface, borderColor: unseen ? colors.accent : colors.border }]}>
        <View style={styles.cardHeader}>
          <Text variant="caption" tone={unseen ? 'accent' : 'textTertiary'}>{item.sender?.username ? `@${item.sender.username}` : 'Someone'} shared</Text>
          <View style={styles.metaRight}>
            {unseen ? <View style={[styles.dot, { backgroundColor: colors.accent }]} /> : null}
            <Text variant="caption" tone="textTertiary">{formatTime(item.createdAt)}</Text>
          </View>
        </View>
        <Text variant="bodyStrong" numberOfLines={2}>{title}</Text>
        {item.description ? <Text variant="bodySm" tone="textSecondary" numberOfLines={2}>{item.description}</Text> : <Text variant="bodySm" tone="textTertiary" numberOfLines={1}>{hostOf(item.linkUrl)}</Text>}
        {item.message ? <View style={[styles.note, { backgroundColor: colors.surfaceElevated }]}><Text variant="caption" tone="textSecondary" numberOfLines={3}>“{item.message}”</Text></View> : null}
        <View style={styles.actionsRow}>
          <Pressable onPress={(e: any) => { e?.stopPropagation?.(); setMoveTarget(item); }} haptic="light" style={[styles.moveBtn, { borderColor: colors.border }]}>
            <Text variant="caption" tone="textSecondary">Move to category</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const renderInbox = () => {
    if (inbox.isLoading) return <View style={styles.skeletons}>{[0,1,2,3,4].map((k) => <LinkRowSkeleton key={k} />)}</View>;
    if (inbox.isError) return <ErrorState title="Couldn't load shared links" description="Check your connection and try again." onRetry={() => void inbox.refetch()} />;
    const shares = inbox.data?.shares ?? [];
    if (!shares.length) return <EmptyState icon="inbox" title="No shared links yet" description="Links shared with you by other users will appear here." />;
    return (
      <FlatList
        data={shares}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={inbox.isRefetching} onRefresh={() => void inbox.refetch()} tintColor={colors.accent} colors={[colors.accent]} />}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing[2] }]}>
      <View style={styles.header}>
        <Text variant="title1">Shared</Text>
        {(inbox.data?.unseenCount ?? 0) > 0 ? <Text variant="caption" tone="accent">{inbox.data?.unseenCount} new</Text> : null}
      </View>
      <View style={styles.content}>{renderInbox()}</View>
      <ActionSheet
        visible={!!moveTarget}
        title={moveTarget ? `Move “${moveTarget.title || hostOf(moveTarget.linkUrl)}”` : 'Move to category'}
        items={moveCategories.map((c) => ({
          label: c.name, icon: 'folder', onPress: async () => {
            if (!moveTarget) return;
            const target = moveTarget; setMoveTarget(null);
            try { await moveShare.mutateAsync({ id: target.id, category: { id: c.id, name: c.name } }); showToast({ message: `Moved to ${c.name}`, tone: 'success' }); }
            catch { showToast({ message: 'Could not move shared link', tone: 'danger' }); }
          },
        }))}
        onClose={() => setMoveTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: spacing[4], paddingBottom: spacing[2] },
  content: { flex: 1 },
  listContent: { paddingHorizontal: spacing[4], paddingTop: spacing[2], paddingBottom: 40, gap: spacing[3] },
  card: { borderWidth: 1, borderRadius: radius.md, padding: spacing[4], gap: spacing[2] },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  metaRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  note: { marginTop: spacing[1], paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderRadius: radius.sm },
  skeletons: { paddingTop: spacing[2] },
  actionsRow: { marginTop: spacing[1], flexDirection: 'row', justifyContent: 'flex-start' },
  moveBtn: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: spacing[3], paddingVertical: spacing[2] },
});

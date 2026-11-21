import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import {
  useAllLinksQuery,
  useDeleteLinkMutation,
  useUpdateLinkMutation,
} from '@/src/data/links';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { hostOf, type Category } from '@/src/types';
import {
  Button,
  Chip,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Field,
  IconButton,
  Input,
  SendToUserSheet,
  Skeleton,
  Text,
  useToast,
} from '@/src/ui';

export default function LinkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showToast } = useToast();

  const linksQuery = useAllLinksQuery();
  const updateLink = useUpdateLinkMutation();
  const deleteLink = useDeleteLinkMutation();

  const link = linksQuery.data?.find((item) => item.id === id);

  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [sendVisible, setSendVisible] = useState(false);

  useEffect(() => {
    if (!link) return;
    setDescription(link.description ?? '');
    setCategory(link.category ?? null);
  }, [link]);

  const handleOpen = () => {
    if (!link) return;
    void WebBrowser.openBrowserAsync(link.linkUrl);
  };

  const handleCopy = async () => {
    if (!link) return;
    await Clipboard.setStringAsync(link.linkUrl);
    showToast({ message: 'Link copied to clipboard', tone: 'success' });
  };

  const handleShare = async () => {
    if (!link) return;
    try {
      await Share.share({ url: link.linkUrl, message: link.linkUrl });
    } catch {
      // dismissed
    }
  };

  const handleSave = async () => {
    if (!link) return;
    try {
      await updateLink.mutateAsync({
        id: link.id,
        description: description.trim(),
        category: category ?? link.category,
      });
      setEditing(false);
      showToast({ message: 'Link updated', tone: 'success' });
    } catch {
      showToast({ message: 'Failed to update link', tone: 'danger' });
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    try {
      await deleteLink.mutateAsync(link.id);
      setDeleteVisible(false);
      showToast({ message: 'Link deleted', tone: 'success' });
      router.back();
    } catch {
      showToast({ message: 'Failed to delete link', tone: 'danger' });
    }
  };

  const renderBody = () => {
    if (linksQuery.isLoading) {
      return (
        <View style={styles.loading}>
          <Skeleton height={180} radiusValue={radius.md} />
          <Skeleton width="70%" height={22} style={{ marginTop: 20 }} />
          <Skeleton width="45%" height={14} style={{ marginTop: 10 }} />
          <Skeleton width="90%" height={14} style={{ marginTop: 20 }} />
          <Skeleton width="85%" height={14} style={{ marginTop: 8 }} />
        </View>
      );
    }

    if (linksQuery.isError) {
      return (
        <ErrorState
          title="Couldn't load this link"
          onRetry={() => void linksQuery.refetch()}
        />
      );
    }

    if (!link) {
      return (
        <EmptyState
          icon="link-off"
          title="Link not found"
          description="It may have been deleted or moved."
          actionLabel="Back to library"
          onAction={() => router.back()}
        />
      );
    }

    const host = hostOf(link.linkUrl);
    const created = link.createdAt
      ? new Date(link.createdAt).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      : undefined;

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {link.imageUrl ? (
          <Image
            source={{ uri: link.imageUrl }}
            style={styles.hero}
            contentFit="cover"
            transition={200}
            accessible={false}
          />
        ) : null}

        <View style={styles.body}>
          {link.siteName ? (
            <Text variant="overline" tone="accent" numberOfLines={1}>
              {link.siteName}
            </Text>
          ) : null}
          <Text variant="title1" style={styles.title}>
            {link.title || host}
          </Text>
          <Text variant="bodySm" tone="textTertiary" numberOfLines={1}>
            {host}
            {created ? ` · Saved ${created}` : ''}
          </Text>
          {link.sharedBy?.username ? (
            <View style={[styles.sharedBy, { backgroundColor: colors.accentMuted }]}>
              <MaterialIcons name="person-outline" size={14} color={colors.accent} />
              <Text variant="caption" tone="accent">Shared by @{link.sharedBy.username}</Text>
            </View>
          ) : null}

          {editing ? (
            <View style={styles.editSection}>
              <Field label="Description" helper="Title editing is coming soon.">
                <Input
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add a short description"
                  multiline
                />
              </Field>

              <Text variant="label" tone="textSecondary" style={styles.categoryLabel}>
                Category
              </Text>
              <View style={styles.categoryRow}>
                {(user?.categories ?? []).map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    selected={category?.id === item.id}
                    onPress={() => setCategory(item)}
                  />
                ))}
              </View>

              <View style={styles.editActions}>
                <View style={styles.editAction}>
                  <Button
                    label="Cancel"
                    variant="secondary"
                    onPress={() => setEditing(false)}
                    disabled={updateLink.isPending}
                  />
                </View>
                <View style={styles.editAction}>
                  <Button
                    label="Save changes"
                    onPress={() => void handleSave()}
                    loading={updateLink.isPending}
                  />
                </View>
              </View>
            </View>
          ) : (
            <>
              {link.description ? (
                <Text variant="body" tone="textSecondary" style={styles.description}>
                  {link.description}
                </Text>
              ) : (
                <Text variant="body" tone="textTertiary" style={styles.description}>
                  No description yet.
                </Text>
              )}

              {link.category ? (
                <View style={styles.categoryTag}>
                  <Chip label={link.category.name} selected />
                </View>
              ) : null}

              <View style={styles.actions}>
                <Button
                  label="Open link"
                  onPress={handleOpen}
                  leftIcon={
                    <MaterialIcons name="open-in-new" size={20} color={colors.onAccent} />
                  }
                />
                <View style={styles.secondaryActions}>
                  <View style={styles.secondaryAction}>
                    <Button
                      label="Copy"
                      variant="secondary"
                      onPress={() => void handleCopy()}
                      leftIcon={<MaterialIcons name="content-copy" size={18} color={colors.text} />}
                    />
                  </View>
                  <View style={styles.secondaryAction}>
                    <Button
                      label="Share"
                      variant="secondary"
                      onPress={() => void handleShare()}
                      leftIcon={<MaterialIcons name="ios-share" size={18} color={colors.text} />}
                    />
                  </View>
                </View>
                <Button
                  label="Send to user"
                  variant="secondary"
                  onPress={() => setSendVisible(true)}
                  leftIcon={<MaterialIcons name="person-add-alt" size={18} color={colors.text} />}
                />
                <Button
                  label="Delete link"
                  variant="destructive"
                  onPress={() => setDeleteVisible(true)}
                  leftIcon={<MaterialIcons name="delete-outline" size={20} color={colors.danger} />}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <IconButton
          icon={<MaterialIcons name="arrow-back" size={24} color={colors.text} />}
          accessibilityLabel="Go back"
          variant="surface"
          onPress={() => router.back()}
        />
        <Text variant="title2" style={styles.headerTitle}>
          {editing ? 'Edit link' : 'Link'}
        </Text>
        {link && !editing ? (
          <IconButton
            icon={<MaterialIcons name="edit" size={22} color={colors.text} />}
            accessibilityLabel="Edit link"
            variant="surface"
            onPress={() => setEditing(true)}
          />
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      <View style={styles.content}>{renderBody()}</View>

      <SendToUserSheet
        visible={sendVisible}
        link={link ?? null}
        onClose={() => setSendVisible(false)}
      />

      <ConfirmDialog
        visible={deleteVisible}
        title="Delete link?"
        message={link ? `“${link.title}” will be removed from your library.` : undefined}
        confirmLabel="Delete"
        destructive
        loading={deleteLink.isPending}
        onConfirm={() => void handleDelete()}
        onCancel={() => setDeleteVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  content: { flex: 1 },
  scrollContent: {
    paddingBottom: spacing[12],
  },
  hero: {
    width: '100%',
    height: 200,
  },
  body: {
    padding: spacing[4],
    gap: spacing[2],
  },
  title: {
    marginTop: 2,
  },
  description: {
    marginTop: spacing[3],
  },
  categoryTag: {
    marginTop: spacing[3],
    flexDirection: 'row',
  },
  sharedBy: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: spacing[3],
  },
  actions: {
    marginTop: spacing[6],
    gap: spacing[3],
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  secondaryAction: {
    flex: 1,
  },
  editSection: {
    marginTop: spacing[4],
  },
  categoryLabel: {
    marginBottom: spacing[2],
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  editActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  editAction: {
    flex: 1,
  },
  loading: {
    padding: spacing[4],
  },
});

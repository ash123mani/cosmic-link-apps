import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/src/api/client';
import { useAuth } from '@/src/context/AuthContext';
import { useAddLinkMutation, useLinkMetaMutation } from '@/src/data/links';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { normalizeUrl, withTimeout } from '@/src/lib/linkUtils';
import type { Category, LinkMeta } from '@/src/types';
import {
  Button,
  Chip,
  Field,
  IconButton,
  Input,
  Sheet,
  Spinner,
  Text,
  useToast,
} from '@/src/ui';

type MetaState = 'idle' | 'fetching' | 'done' | 'error';

export default function QuickCaptureScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();
  const { url: initialUrl } = useLocalSearchParams<{ url?: string }>();

  const addLink = useAddLinkMutation();
  const linkMeta = useLinkMetaMutation();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [metaState, setMetaState] = useState<MetaState>('idle');
  const [urlError, setUrlError] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const [newCategoryVisible, setNewCategoryVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryError, setNewCategoryError] = useState<string | undefined>();
  const [creatingCategory, setCreatingCategory] = useState(false);

  const hasAutoFetched = useRef(false);

  useEffect(() => {
    if (user?.categories?.length && !category) {
      setCategory(user.categories[0]);
    }
  }, [user?.categories, category]);

  const fetchMeta = useCallback(
    async (rawUrl: string) => {
      const normalized = normalizeUrl(rawUrl);
      if (!normalized) {
        setUrlError('Enter a valid link, for example https://example.com');
        setMetaState('error');
        return;
      }
      setUrlError(undefined);
      setMetaState('fetching');
      try {
        const result = await withTimeout(linkMeta.mutateAsync(normalized), 10_000);
        setMeta(result ?? null);
        if (result?.title) setTitle(result.title);
        if (result?.description) setDescription(result.description);
        setMetaState('done');
      } catch {
        setMeta(null);
        setMetaState('error');
      }
    },
    [linkMeta],
  );

  useEffect(() => {
    if (!initialUrl) return;
    hasAutoFetched.current = false;
    setUrl(initialUrl);
    setTitle('');
    setDescription('');
    setMeta(null);
    setCategory(user?.categories?.[0] ?? null);
    setMetaState('idle');
    setUrlError(undefined);
  }, [initialUrl, user?.categories]);

  useEffect(() => {
    if (!initialUrl || hasAutoFetched.current) return;
    hasAutoFetched.current = true;
    void fetchMeta(initialUrl);
  }, [initialUrl, fetchMeta]);

  const handleSave = async () => {
    const normalized = normalizeUrl(url);
    if (!normalized) {
      setUrlError('Enter a valid link, for example https://example.com');
      return;
    }
    if (!title.trim()) {
      showToast({ message: 'Add a title before saving', tone: 'danger' });
      return;
    }
    if (!category) {
      showToast({ message: 'Choose a category before saving', tone: 'danger' });
      return;
    }

    setSaving(true);
    try {
      await addLink.mutateAsync({
        linkUrl: normalized,
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: meta?.imageUrl,
        siteName: meta?.siteName,
      });
      showToast({ message: 'Link saved', tone: 'success' });
      router.replace({ pathname: '/(tabs)/links', params: { categoryId: category.id } });
    } catch {
      showToast({ message: 'Failed to save link', tone: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (name.length < 3) {
      setNewCategoryError('Category names need at least 3 characters');
      return;
    }
    setCreatingCategory(true);
    setNewCategoryError(undefined);
    try {
      const res = await api<{ success: boolean; user: { categories: Category[] } }>(
        '/api/v1/user/category',
        { method: 'PUT', body: { name }, auth: true },
      );
      const created = res.user.categories[res.user.categories.length - 1];
      await refreshUser();
      if (created) setCategory(created);
      setNewCategoryName('');
      setNewCategoryVisible(false);
    } catch {
      setNewCategoryError('Could not create that category');
    } finally {
      setCreatingCategory(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <IconButton
          icon={<MaterialIcons name="close" size={24} color={colors.text} />}
          accessibilityLabel="Close"
          variant="surface"
          onPress={() => router.back()}
        />
        <Text variant="title2" style={styles.headerTitle}>
          Save link
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Field
          label="Link URL"
          required
          error={urlError}
          helper="Paste a link, or share one directly from another app."
        >
          <Input
            value={url}
            onChangeText={(value) => {
              setUrl(value);
              if (urlError) setUrlError(undefined);
            }}
            placeholder="https://example.com"
            keyboardType="url"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="URL"
            autoComplete="url"
            returnKeyType="go"
            onSubmitEditing={() => void fetchMeta(url)}
          />
        </Field>

        <View style={styles.metaAction}>
          {metaState === 'fetching' ? (
            <View style={styles.fetching}>
              <Spinner />
              <Text variant="bodySm" tone="textSecondary">
                Fetching details…
              </Text>
            </View>
          ) : (
            <Button
              label={metaState === 'done' ? 'Refresh details' : 'Fetch details'}
              variant="secondary"
              size="sm"
              fullWidth={false}
              onPress={() => void fetchMeta(url)}
              leftIcon={<MaterialIcons name="auto-awesome" size={18} color={colors.text} />}
            />
          )}
        </View>

        {metaState === 'error' ? (
          <View style={[styles.notice, { backgroundColor: colors.warningMuted }]}>
            <MaterialIcons name="info-outline" size={18} color={colors.warning} />
            <Text variant="bodySm" color={colors.warning} style={styles.noticeText}>
              We couldn&apos;t fetch details automatically. You can fill them in below.
            </Text>
          </View>
        ) : null}

        {meta && (meta.imageUrl || meta.siteName) ? (
          <View style={[styles.preview, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {meta.imageUrl ? (
              <Image
                source={{ uri: meta.imageUrl }}
                style={styles.previewImage}
                contentFit="cover"
                transition={160}
                accessible={false}
              />
            ) : null}
            <View style={styles.previewBody}>
              {meta.siteName ? (
                <Text variant="overline" tone="accent" numberOfLines={1}>
                  {meta.siteName}
                </Text>
              ) : null}
              <Text variant="bodySm" tone="textSecondary" numberOfLines={2}>
                {meta.title || meta.description || 'Details fetched'}
              </Text>
            </View>
          </View>
        ) : null}

        <Field label="Title" required>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="What is this link about?"
            textContentType="none"
          />
        </Field>

        <Field label="Description" helper="Optional — add a note for your future self.">
          <Input
            value={description}
            onChangeText={setDescription}
            placeholder="Add a short description"
            multiline
          />
        </Field>

        <View style={styles.categoryHeader}>
          <Text variant="label" tone="textSecondary">
            Category
          </Text>
          <Chip
            label="New"
            icon={<MaterialIcons name="add" size={16} color={colors.accent} />}
            onPress={() => setNewCategoryVisible(true)}
          />
        </View>

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

        <View style={styles.saveWrap}>
          <Button
            label="Save link"
            onPress={() => void handleSave()}
            loading={saving}
            leftIcon={<MaterialIcons name="bookmark" size={20} color={colors.onAccent} />}
          />
        </View>
      </ScrollView>

      <Sheet
        visible={newCategoryVisible}
        onClose={() => {
          if (creatingCategory) return;
          setNewCategoryVisible(false);
          setNewCategoryError(undefined);
        }}
        title="New category"
        scrollable={false}
      >
        <Field label="Category name" required error={newCategoryError}>
          <Input
            value={newCategoryName}
            onChangeText={(value) => {
              setNewCategoryName(value);
              if (newCategoryError) setNewCategoryError(undefined);
            }}
            placeholder="e.g. Design inspiration"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => void handleCreateCategory()}
          />
        </Field>
        <Button
          label="Create category"
          onPress={() => void handleCreateCategory()}
          loading={creatingCategory}
        />
      </Sheet>
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
  body: { flex: 1 },
  bodyContent: {
    padding: spacing[4],
    paddingBottom: spacing[12],
  },
  metaAction: {
    marginTop: -6,
    marginBottom: spacing[4],
    flexDirection: 'row',
  },
  fetching: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    padding: spacing[3],
    borderRadius: radius.sm,
    marginBottom: spacing[4],
  },
  noticeText: {
    flex: 1,
  },
  preview: {
    flexDirection: 'row',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radius.sm,
    borderWidth: 1,
    marginBottom: spacing[4],
  },
  previewImage: {
    width: 64,
    height: 64,
    borderRadius: radius.xs,
  },
  previewBody: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[6],
  },
  saveWrap: {
    marginTop: spacing[2],
  },
});

import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/src/api/client';
import { useAuth } from '@/src/context/AuthContext';
import { useAllLinkCounts } from '@/src/data/links';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { isSharedCategory, type Category, type LinkItem } from '@/src/types';
import {
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  EmptyState,
  Field,
  IconButton,
  Input,
  Sheet,
  Text,
  useToast,
} from '@/src/ui';

export default function ProfileCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user, refreshUser } = useAuth();
  const { counts } = useAllLinkCounts();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const categories = useMemo<Category[]>(() => user?.categories ?? [], [user?.categories]);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [moveTo, setMoveTo] = useState<Category | null>(null);
  const [processing, setProcessing] = useState(false);

  const [addVisible, setAddVisible] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState<string | undefined>();
  const [creating, setCreating] = useState(false);

  const targetCount = deleteTarget ? (counts[deleteTarget.id] ?? 0) : 0;
  const destinations = categories.filter((item) => item.id !== deleteTarget?.id);

  const openDelete = (category: Category) => {
    if (isSharedCategory(category.id)) {
      showToast({ message: 'Shared is a system category and cannot be deleted', tone: 'default' });
      return;
    }
    if (categories.length <= 1) {
      showToast({ message: 'You need at least one category', tone: 'danger' });
      return;
    }
    setDeleteTarget(category);
    setMoveTo(categories.find((item) => item.id !== category.id && !isSharedCategory(item.id)) ?? categories.find((item) => item.id !== category.id) ?? null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    if (targetCount > 0 && !moveTo) {
      showToast({ message: 'Choose where to move the links', tone: 'danger' });
      return;
    }

    setProcessing(true);
    try {
      if (targetCount > 0 && moveTo) {
        const res = await api<{ links: LinkItem[] }>(`/api/v1/link/${deleteTarget.id}`, {
          auth: true,
        });
        await Promise.all(
          res.links.map((link) =>
            api(`/api/v1/link/${link.id}`, {
              method: 'PATCH',
              body: { description: link.description, category: moveTo },
              auth: true,
            }),
          ),
        );
      }

      await api(`/api/v1/user/category/${deleteTarget.id}`, {
        method: 'DELETE',
        auth: true,
      });
      await refreshUser();
      await queryClient.invalidateQueries({ queryKey: ['links'] });

      showToast({ message: 'Category deleted', tone: 'success' });
      setDeleteTarget(null);
      setMoveTo(null);
    } catch (err) {
      const message = (err as { message?: string })?.message;
      showToast({ message: message || 'Failed to delete category', tone: 'danger' });
    } finally {
      setProcessing(false);
    }
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      setNameError('Category names need at least 3 characters');
      return;
    }
    setCreating(true);
    try {
      await api('/api/v1/user/category', {
        method: 'PUT',
        body: { name: trimmed },
        auth: true,
      });
      await refreshUser();
      setName('');
      setAddVisible(false);
      showToast({ message: 'Category created', tone: 'success' });
    } catch (err) {
      const message = (err as { message?: string })?.message;
      setNameError(message || 'Could not create that category');
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          icon={<MaterialIcons name="arrow-back" size={24} color={colors.text} />}
          accessibilityLabel="Go back"
          variant="surface"
          onPress={() => router.back()}
        />
        <Text variant="title2" style={styles.headerTitle}>
          Categories
        </Text>
        <IconButton
          icon={<MaterialIcons name="add" size={24} color={colors.text} />}
          accessibilityLabel="New category"
          variant="surface"
          onPress={() => setAddVisible(true)}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {categories.length === 0 ? (
          <EmptyState
            icon="folder-open"
            title="No categories yet"
            description="Create a category to start organising your links."
            actionLabel="New category"
            onAction={() => setAddVisible(true)}
          />
        ) : (
          <>
            <Card padding={0}>
              {categories.map((category, index) => {
                const count = counts[category.id] ?? 0;
                const isLast = categories.length <= 1;
                const shared = isSharedCategory(category.id);
                return (
                  <View key={category.id}>
                    <View style={styles.row}>
                      <View style={[styles.folderIcon, { backgroundColor: colors.accentMuted }]}>
                        <MaterialIcons name={shared ? 'inbox' : 'folder'} size={20} color={colors.accent} />
                      </View>
                      <View style={styles.rowText}>
                        <View style={styles.nameRow}>
                          <Text variant="bodyStrong" numberOfLines={1}>
                            {category.name}
                          </Text>
                          {shared ? <Badge label="System" tone="neutral" /> : null}
                        </View>
                        <Text variant="caption" tone="textTertiary">
                          {count} {count === 1 ? 'link' : 'links'}
                        </Text>
                      </View>
                      {shared ? (
                        <View style={styles.lockWrap}>
                          <MaterialIcons name="lock" size={18} color={colors.textTertiary} />
                        </View>
                      ) : (
                        <IconButton
                          icon={
                            <MaterialIcons
                              name="delete-outline"
                              size={20}
                              color={isLast ? colors.textTertiary : colors.danger}
                            />
                          }
                          accessibilityLabel={`Delete ${category.name}`}
                          size={40}
                          disabled={isLast || processing}
                          onPress={() => openDelete(category)}
                        />
                      )}
                    </View>
                    {index < categories.length - 1 ? <Divider style={styles.divider} /> : null}
                  </View>
                );
              })}
            </Card>
            <Text variant="caption" tone="textTertiary" style={styles.hint}>
              Deleting a category moves its links into another category — nothing gets lost. Shared is a system category for links people send you.
            </Text>
          </>
        )}
      </ScrollView>

      <Sheet
        visible={addVisible}
        onClose={() => {
          if (creating) return;
          setAddVisible(false);
          setNameError(undefined);
        }}
        title="New category"
        scrollable={false}
      >
        <Field label="Category name" required error={nameError}>
          <Input
            value={name}
            onChangeText={(value) => {
              setName(value);
              if (nameError) setNameError(undefined);
            }}
            placeholder="e.g. Design inspiration"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={() => void handleCreate()}
          />
        </Field>
        <Button label="Create category" onPress={() => void handleCreate()} loading={creating} />
      </Sheet>

      <Sheet
        visible={!!deleteTarget}
        onClose={() => {
          if (processing) return;
          setDeleteTarget(null);
          setMoveTo(null);
        }}
        title={deleteTarget ? `Delete “${deleteTarget.name}”?` : 'Delete category'}
      >
        <Text variant="bodySm" tone="textSecondary">
          {targetCount > 0
            ? `${targetCount} ${
                targetCount === 1 ? 'link' : 'links'
              } will be moved before the category is removed.`
            : 'This category has no links. Deleting it cannot be undone.'}
        </Text>

        {targetCount > 0 ? (
          <View style={styles.moveSection}>
            <Text variant="label" tone="textSecondary" style={styles.moveLabel}>
              Move links to
            </Text>
            <View style={styles.destinations}>
              {destinations.map((item) => (
                <Chip
                  key={item.id}
                  label={item.name}
                  selected={moveTo?.id === item.id}
                  onPress={() => setMoveTo(item)}
                />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.dialogActions}>
          <View style={styles.dialogAction}>
            <Button
              label="Cancel"
              variant="secondary"
              onPress={() => {
                setDeleteTarget(null);
                setMoveTo(null);
              }}
              disabled={processing}
            />
          </View>
          <View style={styles.dialogAction}>
            <Button
              label="Delete category"
              variant="destructive"
              onPress={() => void handleDelete()}
              loading={processing}
            />
          </View>
        </View>
      </Sheet>
    </View>
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
  content: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  lockWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    marginLeft: spacing[4] + 36 + spacing[3],
  },
  hint: {
    marginTop: spacing[3],
    lineHeight: 18,
  },
  moveSection: {
    marginTop: spacing[4],
  },
  moveLabel: {
    marginBottom: spacing[2],
    marginTop: spacing[4],
  },
  destinations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  dialogActions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[6],
  },
  dialogAction: {
    flex: 1,
  },
});

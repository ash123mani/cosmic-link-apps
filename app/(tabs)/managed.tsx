import { useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/src/ui/Button';
import { EmptyState } from '@/src/ui/EmptyState';
import { ErrorState } from '@/src/ui/ErrorState';
import { Field } from '@/src/ui/Field';
import { Pressable } from '@/src/ui/Pressable';
import { SearchBar } from '@/src/ui/SearchBar';
import { Sheet } from '@/src/ui/Sheet';
import { Spinner } from '@/src/ui/Spinner';
import { Text } from '@/src/ui/Text';
import { useToast } from '@/src/ui/Toast';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useCreateManagedFolderMutation, useManagedFoldersQuery } from '@/src/data/managedFolders';
import { useUserSearchQuery } from '@/src/data/users';
import type { ManagedFolder, UserSummary } from '@/src/types';

function FolderCard({ folder, onPress }: { folder: ManagedFolder; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable accessibilityRole="button" style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onPress}>
      <View style={styles.cardMain}>
        <View style={styles.cardHead}>
          <Text variant="bodyStrong" numberOfLines={1} style={{ flex: 1 }}>{folder.name}</Text>
          <View style={[styles.rolePill, { backgroundColor: colors.accentMuted }]}><Text variant="caption" color={colors.accent} style={styles.roleText}>{folder.myRole}</Text></View>
        </View>
        {folder.description ? <Text variant="bodySm" tone="textSecondary" numberOfLines={2} style={styles.meta}>{folder.description}</Text> : null}
        <Text variant="caption" tone="textTertiary" style={styles.meta}>{folder.memberCount} members · {folder.linkCount} links</Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function ManagedFoldersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showToast } = useToast();
  const folders = useManagedFoldersQuery();
  const createFolder = useCreateManagedFolderMutation();
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberQuery, setMemberQuery] = useState('');
  const [members, setMembers] = useState<UserSummary[]>([]);
  const search = useUserSearchQuery(memberQuery);

  const searchResults = useMemo(() => {
    const selected = new Set(members.map((m) => String(m.id)));
    return (search.data || []).filter((u) => !selected.has(String(u.id)));
  }, [search.data, members]);

  const canCreate = name.trim().length > 0 && members.length > 0 && !createFolder.isPending;

  const closeCreate = () => {
    if (createFolder.isPending) return;
    setShowCreate(false);
    setName('');
    setDescription('');
    setMemberQuery('');
    setMembers([]);
  };

  const onCreate = async () => {
    if (!canCreate) return;
    try {
      const created = await createFolder.mutateAsync({ name: name.trim(), description: description.trim(), memberIds: members.map((m) => m.id) });
      showToast({ message: 'Folder created', tone: 'success' });
      closeCreate();
      router.push(`/managed/${created.id}` as never);
    } catch (error) {
      showToast({ message: (error as Error).message || 'Unable to create folder', tone: 'danger' });
    }
  };

  if (folders.isLoading) return <View style={[styles.center, { backgroundColor: colors.bg }]}><Spinner /></View>;
  if (folders.error && !folders.data) return <ErrorState title="Couldn't load managed folders" description={(folders.error as Error).message} onRetry={() => folders.refetch()} />;

  const data = folders.data ?? [];

  return (
    <View style={[styles.page, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="headline">Managed Folders</Text>
          <Text variant="bodySm" tone="textSecondary" style={{ marginTop: 4 }}>Collaborate on links with role-based access.</Text>
        </View>
        <Button label="New" onPress={() => setShowCreate(true)} size="sm" fullWidth={false} />
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FolderCard folder={item} onPress={() => router.push(`/managed/${item.id}` as never)} />}
        contentContainerStyle={data.length ? styles.list : styles.listEmpty}
        refreshControl={<RefreshControl tintColor={colors.accent} refreshing={folders.isRefetching} onRefresh={() => folders.refetch()} />}
        ListEmptyComponent={<EmptyState icon="group" title="No managed folders" description="Create a folder to collaborate on links with others." actionLabel="Create folder" onAction={() => setShowCreate(true)} />}
      />

      <Sheet visible={showCreate} onClose={closeCreate} title="New managed folder">
        <Field label="Folder name" required>
          <SearchBarLikeInput value={name} onChangeText={setName} placeholder="e.g. Design inspiration" />
        </Field>
        <Field label="Description">
          <SearchBarLikeInput value={description} onChangeText={setDescription} placeholder="Optional description" />
        </Field>
        <Field label="Add members" required helper="Search and select at least one member. You'll be the initial admin.">
          <SearchBar value={memberQuery} onChangeText={setMemberQuery} placeholder="Search by username or email" />
        </Field>
        {members.length > 0 ? (
          <View style={styles.chips}>
            {members.map((m) => (
              <Pressable key={m.id} onPress={() => setMembers((prev) => prev.filter((x) => x.id !== m.id))} style={[styles.chip, { backgroundColor: colors.accentMuted, borderColor: colors.border }]}>
                <Text variant="caption" color={colors.accent}>@{m.username}</Text>
                <MaterialIcons name="close" size={14} color={colors.accent} />
              </Pressable>
            ))}
          </View>
        ) : null}
        {memberQuery.trim().length >= 2 ? (
          <View style={styles.searchResults}>
            {search.isLoading ? <Spinner size="small" /> : null}
            {!search.isLoading && searchResults.length === 0 ? <Text variant="bodySm" tone="textSecondary">No users found.</Text> : null}
            {searchResults.map((u) => (
              <Pressable key={u.id} onPress={() => { setMembers((p) => [...p, u]); setMemberQuery(''); }} style={[styles.searchRow, { borderColor: colors.border, backgroundColor: colors.surfaceElevated }]}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong">@{u.username}</Text>
                  {u.email ? <Text variant="caption" tone="textTertiary">{u.email}</Text> : null}
                </View>
                <MaterialIcons name="add-circle-outline" size={20} color={colors.accent} />
              </Pressable>
            ))}
          </View>
        ) : null}
        <View style={{ marginTop: spacing['2'] }}>
          <Button label="Create folder" onPress={() => void onCreate()} loading={createFolder.isPending} disabled={!canCreate} />
        </View>
      </Sheet>
    </View>
  );
}

function SearchBarLikeInput({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder?: string }) {
  const { colors } = useTheme();
  const { TextInput } = require('react-native');
  return (
    <View style={[styles.inputWrap, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', gap: spacing['3'], alignItems: 'flex-start', paddingHorizontal: spacing['4'], paddingTop: spacing['4'], paddingBottom: spacing['2'] },
  list: { padding: spacing['4'], gap: spacing['3'], paddingBottom: 40 },
  listEmpty: { flexGrow: 1, padding: spacing['4'] },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing['3'], borderWidth: 1, borderRadius: radius.md, padding: spacing['4'], minHeight: 72 },
  cardMain: { flex: 1 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rolePill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  roleText: { textTransform: 'capitalize', fontWeight: '700' },
  meta: { marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing['3'] },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  searchResults: { gap: spacing['2'], marginBottom: spacing['3'] },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderWidth: 1, borderRadius: radius.sm },
  inputWrap: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 12 },
  input: { minHeight: 48, fontSize: 16 },
});

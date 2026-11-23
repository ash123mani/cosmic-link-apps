import { useMemo, useState } from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/src/ui/Button';
import { Card } from '@/src/ui/Card';
import { ConfirmDialog } from '@/src/ui/ConfirmDialog';
import { EmptyState } from '@/src/ui/EmptyState';
import { ErrorState } from '@/src/ui/ErrorState';
import { Field } from '@/src/ui/Field';
import { IconButton } from '@/src/ui/IconButton';
import { Pressable } from '@/src/ui/Pressable';
import { SearchBar } from '@/src/ui/SearchBar';
import { SegmentedControl } from '@/src/ui/SegmentedControl';
import { Sheet } from '@/src/ui/Sheet';
import { Spinner } from '@/src/ui/Spinner';
import { Text } from '@/src/ui/Text';
import { useToast } from '@/src/ui/Toast';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import {
  useAddManagedFolderMembersMutation,
  useCreateManagedFolderLinkMutation,
  useDeleteManagedFolderLinkMutation,
  useDeleteManagedFolderMutation,
  useManagedFolderLinksQuery,
  useManagedFolderQuery,
  useRemoveManagedFolderMemberMutation,
  useUpdateManagedFolderLinkMutation,
  useUpdateManagedFolderMemberRoleMutation,
} from '@/src/data/managedFolders';
import { useUserSearchQuery } from '@/src/data/users';
import type { ManagedFolderLink, ManagedFolderMember } from '@/src/types';

export default function ManagedFolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const folderId = String(id || '');
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();
  const { showToast } = useToast();

  const folderQ = useManagedFolderQuery(folderId);
  const linksQ = useManagedFolderLinksQuery(folderId);
  const deleteFolder = useDeleteManagedFolderMutation();
  const addMembers = useAddManagedFolderMembersMutation(folderId);
  const removeMember = useRemoveManagedFolderMemberMutation(folderId);
  const updateRole = useUpdateManagedFolderMemberRoleMutation(folderId);
  const createLink = useCreateManagedFolderLinkMutation(folderId);
  const updateLink = useUpdateManagedFolderLinkMutation(folderId);
  const deleteLink = useDeleteManagedFolderLinkMutation(folderId);

  const [tab, setTab] = useState<'links' | 'members'>('links');
  const [linkSheet, setLinkSheet] = useState(false);
  const [editing, setEditing] = useState<ManagedFolderLink | null>(null);
  const [linkForm, setLinkForm] = useState({ linkUrl: '', title: '', description: '' });
  const [memberQuery, setMemberQuery] = useState('');
  const [confirmDeleteFolder, setConfirmDeleteFolder] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmLink, setConfirmLink] = useState<ManagedFolderLink | null>(null);
  const [memberTarget, setMemberTarget] = useState<ManagedFolderMember | null>(null);

  const search = useUserSearchQuery(memberQuery);
  const folder = folderQ.data;
  const isAdmin = folder?.myRole === 'admin';
  const me = (folder?.members || []).find((m) => String(m.userId) === String(user?.id));
  const adminCount = (folder?.members || []).filter((m) => m.role === 'admin').length;
  const iAmLastAdmin = me?.role === 'admin' && adminCount <= 1;

  const searchResults = useMemo(() => {
    const members = new Set((folder?.members || []).map((m) => String(m.userId)));
    return (search.data || []).filter((u) => !members.has(String(u.id)));
  }, [search.data, folder?.members]);

  const closeLinkSheet = () => {
    if (createLink.isPending || updateLink.isPending) return;
    setLinkSheet(false);
    setEditing(null);
    setLinkForm({ linkUrl: '', title: '', description: '' });
  };

  const openCreateLink = () => {
    setEditing(null);
    setLinkForm({ linkUrl: '', title: '', description: '' });
    setLinkSheet(true);
  };

  const openEditLink = (link: ManagedFolderLink) => {
    setEditing(link);
    setLinkForm({ linkUrl: link.linkUrl || '', title: link.title || '', description: link.description || '' });
    setLinkSheet(true);
  };

  const saveLink = async () => {
    if (!linkForm.linkUrl.trim() || !linkForm.title.trim()) {
      showToast({ message: 'URL and title are required', tone: 'danger' });
      return;
    }
    try {
      if (editing) {
        await updateLink.mutateAsync({ linkId: editing.id, body: { ...linkForm } });
        showToast({ message: 'Link updated', tone: 'success' });
      } else {
        await createLink.mutateAsync({ ...linkForm });
        showToast({ message: 'Link added', tone: 'success' });
      }
      closeLinkSheet();
    } catch (e: any) {
      showToast({ message: e?.message || 'Unable to save link', tone: 'danger' });
    }
  };

  const onDeleteFolder = async () => {
    try {
      await deleteFolder.mutateAsync(folderId);
      setConfirmDeleteFolder(false);
      showToast({ message: 'Folder deleted', tone: 'success' });
      router.replace('/(tabs)/managed' as never);
    } catch (e: any) {
      showToast({ message: e?.message || 'Unable to delete folder', tone: 'danger' });
    }
  };

  const onLeave = async () => {
    if (!user?.id) return;
    try {
      await removeMember.mutateAsync(user.id);
      setConfirmLeave(false);
      showToast({ message: 'You left the folder', tone: 'success' });
      router.replace('/(tabs)/managed' as never);
    } catch (e: any) {
      showToast({ message: e?.message || 'Unable to leave folder', tone: 'danger' });
    }
  };

  const onDeleteLink = async () => {
    if (!confirmLink) return;
    try {
      await deleteLink.mutateAsync(confirmLink.id);
      setConfirmLink(null);
      showToast({ message: 'Link deleted', tone: 'success' });
    } catch (e: any) {
      showToast({ message: e?.message || 'Unable to delete link', tone: 'danger' });
    }
  };

  const onAddMember = async (userId: string) => {
    try {
      await addMembers.mutateAsync([userId]);
      setMemberQuery('');
      showToast({ message: 'Member added', tone: 'success' });
    } catch (e: any) {
      showToast({ message: e?.message || 'Unable to add member', tone: 'danger' });
    }
  };

  const onMemberAction = async (action: 'make-admin' | 'remove-admin' | 'remove' | 'leave') => {
    if (!memberTarget) return;
    const target = memberTarget;
    setMemberTarget(null);
    try {
      if (action === 'make-admin') {
        await updateRole.mutateAsync({ userId: target.userId, role: 'admin' });
        showToast({ message: 'Member promoted to admin', tone: 'success' });
      } else if (action === 'remove-admin') {
        await updateRole.mutateAsync({ userId: target.userId, role: 'member' });
        showToast({ message: 'Admin role removed', tone: 'success' });
      } else if (action === 'remove') {
        await removeMember.mutateAsync(target.userId);
        showToast({ message: 'Member removed', tone: 'success' });
      } else if (action === 'leave') {
        setConfirmLeave(true);
      }
    } catch (e: any) {
      showToast({ message: e?.message || 'Action failed', tone: 'danger' });
    }
  };

  if (folderQ.isLoading) {
    return <View style={[styles.page, { backgroundColor: colors.bg }]}><View style={styles.center}><Spinner /></View></View>;
  }
  if (folderQ.error || !folder) {
    return <View style={[styles.page, { backgroundColor: colors.bg }]}><ErrorState title="Folder not found" description={(folderQ.error as Error)?.message || 'This managed folder may have been removed.'} onRetry={() => folderQ.refetch()} /></View>;
  }

  const memberIsSelf = memberTarget && String(memberTarget.userId) === String(user?.id);
  const memberLastAdmin = memberTarget?.role === 'admin' && adminCount <= 1;

  return (
    <View style={[styles.page, { backgroundColor: colors.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <IconButton icon={<MaterialIcons name="arrow-back" size={22} color={colors.text} />} onPress={() => router.back()} accessibilityLabel="Back" />
        <View style={styles.headerMain}>
          <Text variant="headline" numberOfLines={1}>{folder.name}</Text>
          <Text variant="caption" tone="textSecondary">{folder.myRole} · {folder.members.length} members · {folder.linkCount} links</Text>
        </View>
        {isAdmin ? (
          <IconButton icon={<MaterialIcons name="delete-outline" size={22} color={colors.danger} />} onPress={() => setConfirmDeleteFolder(true)} accessibilityLabel="Delete folder" />
        ) : (
          <Button label="Leave" variant="ghost" size="sm" fullWidth={false} disabled={iAmLastAdmin} onPress={() => setConfirmLeave(true)} />
        )}
      </View>
      {folder.description ? <Text variant="bodySm" tone="textSecondary" style={styles.description}>{folder.description}</Text> : null}

      <View style={styles.segmentWrap}>
        <SegmentedControl
          options={[{ label: 'Links', value: 'links' }, { label: 'Members', value: 'members' }]}
          value={tab}
          onChange={(v) => setTab(v as 'links' | 'members')}
        />
      </View>

      {tab === 'links' ? (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={linksQ.isRefetching} onRefresh={() => linksQ.refetch()} tintColor={colors.accent} />}
        >
          <Button label="Add link" onPress={openCreateLink} />
          {linksQ.isLoading ? <View style={styles.center}><Spinner /></View> : null}
          {!linksQ.isLoading && (linksQ.data || []).length === 0 ? (
            <EmptyState icon="link" title="No links yet" description="Add the first link for your team." />
          ) : null}
          {(linksQ.data || []).map((item) => {
            const canMutate = isAdmin || String(item.createdBy?.id) === String(user?.id);
            return (
              <Card key={item.id} style={styles.card}>
                <Text variant="title3" numberOfLines={2}>{item.title || item.linkUrl}</Text>
                <Text variant="caption" tone="textTertiary" style={styles.meta}>Added by {item.createdBy?.username || 'member'}{item.lastEditedBy?.username ? ` · Edited by ${item.lastEditedBy.username}` : ''}</Text>
                {item.description ? <Text variant="bodySm" tone="textSecondary" numberOfLines={3} style={styles.meta}>{item.description}</Text> : null}
                {canMutate ? (
                  <View style={styles.rowActions}>
                    <Button label="Edit" variant="secondary" size="sm" fullWidth={false} onPress={() => openEditLink(item)} />
                    <Button label="Delete" variant="destructive" size="sm" fullWidth={false} onPress={() => setConfirmLink(item)} />
                  </View>
                ) : null}
              </Card>
            );
          })}
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {isAdmin ? (
            <Card style={styles.card}>
              <Text variant="title3">Add members</Text>
              <View style={{ marginTop: spacing['3'] }}>
                <SearchBar value={memberQuery} onChangeText={setMemberQuery} placeholder="Search users" />
              </View>
              {memberQuery.trim().length >= 2 ? (
                <View style={styles.searchResults}>
                  {search.isLoading ? <Spinner size="small" /> : null}
                  {!search.isLoading && searchResults.length === 0 ? <Text variant="bodySm" tone="textSecondary">No users found.</Text> : null}
                  {searchResults.map((u) => (
                    <Pressable key={u.id} onPress={() => void onAddMember(u.id)} style={[styles.searchRow, { borderColor: colors.border }]}>
                      <View style={{ flex: 1 }}>
                        <Text variant="bodyStrong">@{u.username}</Text>
                        {u.email ? <Text variant="caption" tone="textTertiary">{u.email}</Text> : null}
                      </View>
                      <MaterialIcons name="person-add" size={20} color={colors.accent} />
                    </Pressable>
                  ))}
                </View>
              ) : (
                <Text variant="caption" tone="textTertiary" style={{ marginTop: spacing['2'] }}>Type at least 2 characters to search.</Text>
              )}
            </Card>
          ) : null}

          {(folder.members || []).map((m) => {
            const self = String(m.userId) === String(user?.id);
            const lastAdmin = m.role === 'admin' && adminCount <= 1;
            return (
              <Pressable key={m.userId} onPress={() => setMemberTarget(m)} style={[styles.memberRow, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <View style={{ flex: 1 }}>
                  <Text variant="bodyStrong">{m.username || m.userId}{self ? ' (You)' : ''}</Text>
                  <Text variant="caption" tone="textTertiary">{m.email || 'No email'} · {m.role}{lastAdmin ? ' · last admin' : ''}</Text>
                </View>
                <MaterialIcons name="more-horiz" size={20} color={colors.textTertiary} />
              </Pressable>
            );
          })}
        </ScrollView>
      )}

      <Sheet visible={linkSheet} onClose={closeLinkSheet} title={editing ? 'Edit link' : 'Add link'}>
        <Field label="URL" required><SearchBarLikeInput value={linkForm.linkUrl} onChangeText={(v) => setLinkForm((p) => ({ ...p, linkUrl: v }))} placeholder="https://..." /></Field>
        <Field label="Title" required><SearchBarLikeInput value={linkForm.title} onChangeText={(v) => setLinkForm((p) => ({ ...p, title: v }))} placeholder="Link title" /></Field>
        <Field label="Description"><SearchBarLikeInput value={linkForm.description} onChangeText={(v) => setLinkForm((p) => ({ ...p, description: v }))} placeholder="Optional description" multiline /></Field>
        <Button label={editing ? 'Save changes' : 'Add link'} onPress={() => void saveLink()} loading={createLink.isPending || updateLink.isPending} />
      </Sheet>

      <Sheet visible={!!memberTarget} onClose={() => setMemberTarget(null)} title={memberTarget?.username || 'Member'}>
        <View style={{ gap: spacing['2'] }}>
          {memberTarget ? <Text variant="bodySm" tone="textSecondary">{memberTarget.email} · {memberTarget.role}{memberLastAdmin ? ' · last admin' : ''}</Text> : null}
          {isAdmin && !memberIsSelf && memberTarget?.role === 'member' ? <Button label="Make admin" variant="secondary" onPress={() => void onMemberAction('make-admin')} /> : null}
          {isAdmin && !memberIsSelf && memberTarget?.role === 'admin' ? <Button label="Remove admin" variant="secondary" disabled={!!memberLastAdmin} onPress={() => void onMemberAction('remove-admin')} /> : null}
          {isAdmin && !memberIsSelf ? <Button label="Remove member" variant="destructive" disabled={!!memberLastAdmin} onPress={() => void onMemberAction('remove')} /> : null}
          {memberIsSelf ? <Button label="Leave folder" variant="destructive" disabled={!!memberLastAdmin} onPress={() => void onMemberAction('leave')} /> : null}
          {memberLastAdmin ? <Text variant="caption" tone="danger">Folder must have at least one admin.</Text> : null}
        </View>
      </Sheet>

      <ConfirmDialog visible={confirmDeleteFolder} title="Delete folder?" message="This deletes the folder and all links for everyone." confirmLabel="Delete" destructive loading={deleteFolder.isPending} onConfirm={() => void onDeleteFolder()} onCancel={() => setConfirmDeleteFolder(false)} />
      <ConfirmDialog visible={confirmLeave} title="Leave folder?" message="You will lose access. Links you added will remain." confirmLabel="Leave" destructive loading={removeMember.isPending} onConfirm={() => void onLeave()} onCancel={() => setConfirmLeave(false)} />
      <ConfirmDialog visible={!!confirmLink} title="Delete link?" message="This removes the link for everyone in the folder." confirmLabel="Delete" destructive loading={deleteLink.isPending} onConfirm={() => void onDeleteLink()} onCancel={() => setConfirmLink(null)} />
    </View>
  );
}

function SearchBarLikeInput({ value, onChangeText, placeholder, multiline }: { value: string; onChangeText: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[inputStyles.wrap, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
      <TextInputLike value={value} onChangeText={onChangeText} placeholder={placeholder} multiline={multiline} />
    </View>
  );
}

function TextInputLike({ value, onChangeText, placeholder, multiline }: { value: string; onChangeText: (v: string) => void; placeholder?: string; multiline?: boolean }) {
  const { colors } = useTheme();
  const { TextInput } = require('react-native');
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textTertiary}
      multiline={multiline}
      style={[inputStyles.input, { color: colors.text, minHeight: multiline ? 88 : 48 }]}
      autoCapitalize="none"
      autoCorrect={false}
    />
  );
}

const inputStyles = StyleSheet.create({
  wrap: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: 12 },
  input: { fontSize: 16, paddingVertical: 12, textAlignVertical: 'top' },
});

const styles = StyleSheet.create({
  page: { flex: 1 },
  center: { flex: 1, paddingVertical: 32, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing['4'], paddingTop: spacing['3'], paddingBottom: spacing['2'] },
  headerMain: { flex: 1 },
  description: { paddingHorizontal: spacing['4'], marginBottom: spacing['2'] },
  segmentWrap: { paddingHorizontal: spacing['4'], marginBottom: spacing['2'] },
  content: { padding: spacing['4'], gap: spacing['3'], paddingBottom: 40 },
  card: { padding: spacing['4'] },
  meta: { marginTop: 6 },
  rowActions: { flexDirection: 'row', gap: spacing['2'], marginTop: spacing['3'] },
  searchResults: { gap: spacing['2'], marginTop: spacing['3'] },
  searchRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderRadius: radius.sm, gap: 12 },
  memberRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderWidth: 1, borderRadius: radius.md, gap: 12 },
});

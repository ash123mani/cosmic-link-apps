import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUserSearchQuery } from '@/src/data/users';
import { useSendShareMutation } from '@/src/data/shares';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import type { LinkItem, UserSummary } from '@/src/types';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { Field } from './Field';
import { Input } from './Input';
import { Pressable } from './Pressable';
import { SearchBar } from './SearchBar';
import { Sheet } from './Sheet';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useToast } from './Toast';

interface SendToUserSheetProps {
  visible: boolean;
  link: LinkItem | null;
  onClose: () => void;
}

export function SendToUserSheet({ visible, link, onClose }: SendToUserSheetProps) {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const sendShare = useSendShareMutation();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!visible) return;
    setQuery('');
    setDebouncedQuery('');
    setSelectedUser(null);
    setMessage('');
  }, [visible, link?.id]);

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(handle);
  }, [query]);

  const searchQuery = useUserSearchQuery(debouncedQuery);
  const users = searchQuery.data ?? [];
  const canSearch = debouncedQuery.length >= 2;

  const helper = useMemo(() => {
    if (!canSearch) return 'Search by username (at least 2 characters).';
    if (searchQuery.isLoading) return 'Searching...';
    return undefined;
  }, [canSearch, searchQuery.isLoading]);

  const handleClose = () => {
    if (sendShare.isPending) return;
    onClose();
  };

  const handleSend = async () => {
    if (!link || !selectedUser) return;
    try {
      await sendShare.mutateAsync({
        linkId: link.id,
        recipientIds: [selectedUser.id],
        message: message.trim() || undefined,
      });
      showToast({ message: `Sent to @${selectedUser.username}`, tone: 'success' });
      onClose();
    } catch (err) {
      const apiError = err as { status?: number; message?: string };
      const msg = apiError.message || 'Could not send this link';
      if (apiError.status === 409) {
        showToast({ message: msg || 'Already shared with this user', tone: 'default' });
      } else {
        showToast({ message: msg, tone: 'danger' });
      }
    }
  };

  return (
    <Sheet visible={visible} onClose={handleClose} title="Send to user" scrollable>
      <View style={styles.section}>
        <Text variant="bodySm" tone="textSecondary" numberOfLines={2}>
          {link ? link.title || link.linkUrl : 'Select a link to share'}
        </Text>
      </View>

      <View style={styles.section}>
        <SearchBar
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setSelectedUser(null);
          }}
          onClear={() => {
            setQuery('');
            setDebouncedQuery('');
            setSelectedUser(null);
          }}
          placeholder="Username or email"
          autoFocus
        />
        {helper ? (
          <Text variant="caption" tone="textTertiary" style={styles.helper}>
            {helper}
          </Text>
        ) : null}
      </View>

      <View style={styles.results}>
        {searchQuery.isError ? (
          <Text variant="bodySm" tone="danger">
            Could not search users. Please try again.
          </Text>
        ) : null}

        {canSearch && !searchQuery.isLoading && !searchQuery.isError && users.length === 0 ? (
          <View style={styles.emptyWrap}>
            <EmptyState
              icon="person-search"
              title="No users found"
              description="Try a different username."
            />
          </View>
        ) : null}

        {users.map((user) => {
          const selected = selectedUser?.id === user.id;
          return (
            <Pressable
              key={user.id}
              onPress={() => setSelectedUser(user)}
              haptic="selection"
              accessibilityRole="button"
              accessibilityLabel={`Send to ${user.username}`}
              style={[
                styles.userRow,
                {
                  borderColor: selected ? colors.accent : colors.border,
                  backgroundColor: selected ? colors.accentMuted : colors.surfaceElevated,
                },
              ]}
            >
              <View style={[styles.avatar, { backgroundColor: colors.accentMuted }]}>
                <MaterialIcons name="person" size={18} color={colors.accent} />
              </View>
              <View style={styles.userText}>
                <Text variant="bodyStrong" numberOfLines={1}>
                  @{user.username}
                </Text>
                {user.email ? (
                  <Text variant="caption" tone="textTertiary" numberOfLines={1}>
                    {user.email}
                  </Text>
                ) : null}
              </View>
              {selected ? (
                <MaterialIcons name="check-circle" size={20} color={colors.accent} />
              ) : null}
            </Pressable>
          );
        })}

        {searchQuery.isFetching && canSearch ? (
          <View style={styles.loadingRow}>
            <Spinner size="small" />
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Field label="Note (optional)">
          <Input
            value={message}
            onChangeText={setMessage}
            placeholder="Add a short note"
            multiline
            maxLength={280}
          />
        </Field>
      </View>

      <Button
        label={selectedUser ? `Send to @${selectedUser.username}` : 'Send'}
        onPress={() => void handleSend()}
        loading={sendShare.isPending}
        disabled={!link || !selectedUser || sendShare.isPending}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing[4],
  },
  helper: {
    marginTop: spacing[2],
  },
  results: {
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    flex: 1,
    gap: 1,
  },
  loadingRow: {
    paddingVertical: spacing[2],
    alignItems: 'center',
  },
  emptyWrap: {
    minHeight: 120,
  },
});

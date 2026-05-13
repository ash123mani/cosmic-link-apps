import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Share, Alert } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';

interface Link {
  id: string;
  linkUrl: string;
  title: string;
  description?: string;
  imageUrl?: string;
  siteName?: string;
  category?: { name: string };
}

interface Props {
  link: Link;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onDelete }: Props) {
  const handleShare = async () => {
    try {
      await Share.share({ url: link.linkUrl, message: link.linkUrl });
    } catch {
      // user dismissed
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Link', 'Are you sure you want to delete this link?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(link.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>{link.title}</Text>
      <Text style={styles.url} numberOfLines={1}>{link.linkUrl}</Text>
      {link.description ? <Text style={styles.description} numberOfLines={2}>{link.description}</Text> : null}
      <View style={styles.actions}>
        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareText}>Share</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.md,
    marginVertical: 6,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    ...Shadow.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.blackMedium,
    marginBottom: Spacing.xs,
  },
  url: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.gray,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  shareBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.bodyBg,
  },
  shareText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.blackMedium,
  },
  deleteBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.deleteBg,
  },
  deleteText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.error },
});

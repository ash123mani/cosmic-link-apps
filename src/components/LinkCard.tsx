import { View, Text, StyleSheet, Pressable, Alert, Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

interface Category {
  name: string;
  id: string;
}

interface LinkItem {
  id: string;
  linkUrl: string;
  title: string;
  description?: string;
  category: Category;
  imageUrl?: string;
  siteName?: string;
  userId: string;
}

interface Props {
  link: LinkItem;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, onDelete }: Props) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(link.linkUrl);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  const handleShare = async () => {
    await Share.share({ url: link.linkUrl, message: link.linkUrl });
  };

  const handleDelete = () => {
    Alert.alert('Delete Link', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(link.id) },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{link.title}</Text>
        {link.description ? (
          <Text style={styles.description} numberOfLines={2}>{link.description}</Text>
        ) : null}
        <Text style={styles.url} numberOfLines={1}>{link.linkUrl}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={handleCopy}>
          <Text style={styles.actionText}>Copy</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={handleShare}>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={handleDelete}>
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A2438',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  url: {
    fontSize: 12,
    color: '#1001D4',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F4F9',
  },
  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2A2438',
  },
  deleteBtn: {
    backgroundColor: '#FEE',
  },
  deleteText: {
    color: '#CF462D',
  },
});

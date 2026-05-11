import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { LinkMetaPreview } from './LinkMetaPreview';

interface Category {
  name: string;
  id: string;
}

interface LinkMeta {
  siteName?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  imageUrl?: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedCategory: Category | null;
  onSubmit: (data: {
    linkUrl: string;
    title: string;
    description: string;
    category: Category;
    imageUrl?: string;
    siteName?: string;
  }) => Promise<void>;
  onFetchMeta: (url: string) => Promise<LinkMeta>;
}

export function AddLinkModal({ visible, onClose, categories, selectedCategory, onSubmit, onFetchMeta }: Props) {
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(selectedCategory);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const handleFetchMeta = async () => {
    console.log('[AddLinkModal] handleFetchMeta called, url:', url);
    if (!url.trim()) {
      console.log('[AddLinkModal] url is empty, returning early');
      Alert.alert('Info', 'Please paste a URL first');
      return;
    }
    setFetchingMeta(true);
    try {
      console.log('[AddLinkModal] calling onFetchMeta with:', url.trim());
      const result = await onFetchMeta(url.trim());
      console.log('[AddLinkModal] onFetchMeta result:', result);
      setMeta(result);
      setTitle(result.title || '');
      setDescription(result.description || '');
    } catch (err) {
      console.log('[AddLinkModal] onFetchMeta error:', err);
      Alert.alert('Error', 'Unable to fetch link metadata');
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleSubmit = async () => {
    if (!url.trim() || !title.trim() || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        linkUrl: url.trim(),
        title: title.trim(),
        description: description.trim(),
        category,
        imageUrl: meta?.imageUrl,
        siteName: meta?.siteName,
      });
      setUrl('');
      setMeta(null);
      setTitle('');
      setDescription('');
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Link</Text>
            <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Paste URL here"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable style={styles.fetchBtn} onPress={handleFetchMeta} disabled={fetchingMeta}>
            {fetchingMeta ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.fetchBtnText}>Fetch Metadata</Text>
            )}
          </Pressable>

          {meta ? <LinkMetaPreview meta={meta} /> : null}

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                style={[styles.categoryChip, category?.id === cat.id && styles.categoryChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryChipText, category?.id === cat.id && styles.categoryChipTextActive]}>
                  {cat.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Save Link</Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2438',
  },
  close: {
    fontSize: 22,
    color: '#666',
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 12,
    color: '#2A2438',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2438',
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F4F9',
  },
  categoryChipActive: {
    backgroundColor: '#1001D4',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#2A2438',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  fetchBtn: {
    backgroundColor: '#1001D4',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  fetchBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: '#1001D4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

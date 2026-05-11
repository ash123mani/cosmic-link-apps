import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/theme';
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
    if (!url.trim()) {
      Alert.alert('Info', 'Please paste a URL first');
      return;
    }
    setFetchingMeta(true);
    try {
      const result = await onFetchMeta(url.trim());
      setMeta(result);
      setTitle(result.title || '');
      setDescription(result.description || '');
    } catch {
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
            <Text style={styles.heading}>Add Link</Text>
            <Pressable onPress={onClose}><Text style={styles.close}>✕</Text></Pressable>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Paste URL here"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={Colors.gray}
          />
          <Pressable style={styles.fetchBtn} onPress={handleFetchMeta} disabled={fetchingMeta}>
            {fetchingMeta ? (
              <ActivityIndicator color={Colors.white} />
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
            placeholderTextColor={Colors.gray}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.gray}
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
              <ActivityIndicator color={Colors.white} />
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
    backgroundColor: Colors.white,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.blackMedium,
  },
  close: { fontSize: 22, color: Colors.gray, padding: 4 },
  input: {
    borderWidth: 1,
    borderColor: Colors.blackLight,
    borderRadius: 4,
    padding: 14,
    fontSize: 15,
    
    marginBottom: 12,
    color: Colors.blackMedium,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackMedium,
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
    borderRadius: 4,
    backgroundColor: Colors.bodyBg,
  },
  categoryChipActive: { backgroundColor: Colors.primary },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.blackMedium,
  },
  categoryChipTextActive: { color: Colors.white },
  fetchBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  fetchBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

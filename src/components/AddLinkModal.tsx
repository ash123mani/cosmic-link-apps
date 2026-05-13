import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';
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
  initialUrl?: string;
  autoFetch?: boolean;
}

export function AddLinkModal({ visible, onClose, categories, selectedCategory, onSubmit, onFetchMeta, initialUrl, autoFetch }: Props) {
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<LinkMeta | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(selectedCategory);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const autoFetched = useRef(false);

  useEffect(() => {
    if (visible && initialUrl) {
      setUrl(initialUrl);
      setMeta(null);
      setTitle('');
      setDescription('');
      autoFetched.current = false;
    }
  }, [visible, initialUrl]);

  useEffect(() => {
    if (visible && initialUrl && autoFetch && url === initialUrl && !autoFetched.current && !fetchingMeta) {
      autoFetched.current = true;
      handleFetchMeta();
    }
  }, [visible, initialUrl, autoFetch, url]);

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
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  heading: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.blackMedium,
  },
  close: { fontSize: 22, color: Colors.gray, padding: Spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: Colors.blackLight,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSize.md,
    marginBottom: Spacing.sm + Spacing.xs,
    color: Colors.blackMedium,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.blackMedium,
    marginBottom: Spacing.sm,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.bodyBg,
  },
  categoryChipActive: { backgroundColor: Colors.primary },
  categoryChipText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.blackMedium,
  },
  categoryChipTextActive: { color: Colors.white },
  fetchBtn: {
    backgroundColor: Colors.primary,
    padding: Spacing.sm + 6,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  fetchBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  submitBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: FontSize.lg,
  },
});

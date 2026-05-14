import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/src/api/client';
import { useAuth } from '@/src/context/AuthContext';
import { Colors, BorderRadius, Spacing, FontSize, FontFamily } from '@/constants/theme';
import { PressableScale } from '@/src/components/PressableScale';
import { AddCategoryModal } from '@/src/components/AddCategoryModal';
import { LinkMetaPreview } from '@/src/components/LinkMetaPreview';

interface Category {
  name: string;
  id: string;
}

export default function AddLinkScreen() {
  const insets = useSafeAreaInsets();
  const { user, refreshUser } = useAuth();
  const { url: initialUrl } = useLocalSearchParams<{ url?: string }>();

  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [meta, setMeta] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [addCatVisible, setAddCatVisible] = useState(false);

  const hasAutoFetched = useRef(false);

  // Reset and auto-fetch when a new share intent arrives
  useEffect(() => {
    if (!initialUrl) return;
    hasAutoFetched.current = false;
    setStep(1);
    setUrl(initialUrl);
    setMeta(null);
    setTitle('');
    setDescription('');
    setCategory(null);
    setFetching(false);
    setLoading(false);
  }, [initialUrl]);

  // Auto-fetch metadata once after share intent populates the URL
  useEffect(() => {
    if (!initialUrl || !url || step !== 1 || hasAutoFetched.current) return;
    hasAutoFetched.current = true;
    const currentUrl = url;
    (async () => {
      setFetching(true);
      try {
        const res = await api<{ success: boolean; meta: any }>('/api/v1/link/meta', {
          method: 'POST',
          body: { linkUrl: currentUrl },
        });
        const m = res.meta;
        setMeta(m || null);
        setTitle(m?.title || '');
        setDescription(m?.description || '');
      } catch {
        // Silent — user fills details manually in step 2
      } finally {
        setFetching(false);
        setStep(2);
      }
    })();
  }, [initialUrl, url, step]);

  // Pick first category when user data loads or after reset
  useEffect(() => {
    if (user?.categories?.length && !category) {
      setCategory(user.categories[0]);
    }
  }, [user?.categories, category]);

  const handleContinue = async () => {
    if (!url.trim()) {
      Alert.alert('Info', 'Please enter a URL');
      return;
    }
    setFetching(true);
    const currentUrl = url.trim();
    try {
      const res = await api<{ success: boolean; meta: any }>('/api/v1/link/meta', {
        method: 'POST',
        body: { linkUrl: currentUrl },
      });
      const m = res.meta;
      setMeta(m || null);
      setTitle(m?.title || '');
      setDescription(m?.description || '');
    } catch {
      // Silent — user fills details manually in step 2
    } finally {
      setFetching(false);
      setStep(2);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !category) {
      Alert.alert('Error', 'Please fill in the title and select a category');
      return;
    }
    setLoading(true);
    try {
      await api<{ success: boolean }>('/api/v1/link', {
        method: 'POST',
        body: {
          linkUrl: url.trim(),
          title: title.trim(),
          description: description.trim(),
          category,
          imageUrl: meta?.imageUrl,
          siteName: meta?.siteName,
        },
        auth: true,
      });
      router.replace(`/(tabs)/links?categoryId=${category.id}`);
    } catch {
      Alert.alert('Error', 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (name: string) => {
    await api<{ success: boolean; user: any }>('/api/v1/user/category', {
      method: 'PUT',
      body: { name },
      auth: true,
    });
    await refreshUser();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <PressableScale
          onPress={() => {
            if (step === 2) { setStep(1); return; }
            router.back();
          }}
          style={styles.backBtn}
        >
          <MaterialIcons name={step === 2 ? 'arrow-back' : 'close'} size={24} color={Colors.text} />
        </PressableScale>
        <Text style={styles.title}>Add Link</Text>
        {step === 2 && (
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Step 2 of 2</Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 ? (
          <View style={styles.stepWrap}>
            <Text style={styles.stepLabel}>Step 1</Text>
            <Text style={styles.stepTitle}>Enter Link URL</Text>
            <Text style={styles.stepDesc}>
              Paste a link below or share from any app in one tap.
            </Text>

            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={Colors.textMuted}
            />

            <PressableScale style={styles.continueBtn} onPress={handleContinue} disabled={fetching}>
              {fetching ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.continueBtnText}>Continue</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
                </>
              )}
            </PressableScale>

            <View style={styles.shareHint}>
              <MaterialIcons name="ios-share" size={16} color={Colors.textMuted} />
              <Text style={styles.shareHintText}>  Share links from any app directly here</Text>
            </View>
          </View>
        ) : (
          <View style={styles.stepWrap}>
            <Text style={styles.stepLabel}>Step 2</Text>
            <Text style={styles.stepTitle}>Review & Save</Text>
            <Text style={styles.stepDesc}>
              Edit the details and save to a category.
            </Text>

            {meta && <LinkMetaPreview meta={meta} />}

            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Link title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.fieldLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a description (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {user?.categories?.map((cat: Category) => (
                <PressableScale
                  key={cat.id}
                  style={[styles.categoryChip, category?.id === cat.id && styles.categoryChipActive]}
                  onPress={() => setCategory(cat)}
                  scaleIn={0.93}
                >
                  <MaterialIcons
                    name="folder"
                    size={14}
                    color={category?.id === cat.id ? Colors.white : Colors.primary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.categoryChipText, category?.id === cat.id && styles.categoryChipTextActive]}>
                    {cat.name}
                  </Text>
                </PressableScale>
              ))}
              <PressableScale style={styles.addCatChip} onPress={() => setAddCatVisible(true)} scaleIn={0.9}>
                <MaterialIcons name="add" size={20} color={Colors.primary} />
              </PressableScale>
            </View>

            <PressableScale style={styles.saveBtn} onPress={handleSave} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <MaterialIcons name="bookmark" size={20} color={Colors.white} />
                  <Text style={styles.saveBtnText}>  Save Link</Text>
                </>
              )}
            </PressableScale>
          </View>
        )}
      </ScrollView>

      <AddCategoryModal
        visible={addCatVisible}
        onClose={() => setAddCatVisible(false)}
        onSubmit={handleAddCategory}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontSize: FontSize.xxxl, fontWeight: '700', color: Colors.text, flex: 1 },
  stepBadge: {
    backgroundColor: Colors.bgLight,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBadgeText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  body: { flex: 1 },
  bodyContent: { padding: Spacing.md, paddingBottom: Spacing.xl },
  stepWrap: { gap: Spacing.sm },
  stepLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  stepTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.text },
  stepDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
  urlInput: {
    fontFamily: FontFamily,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.bgLight,
    marginTop: Spacing.sm,
  },
  continueBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    padding: Spacing.md + 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.sm,
  },
  continueBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
  shareHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  shareHintText: { fontSize: FontSize.xs, color: Colors.textMuted },
  fieldLabel: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  input: {
    fontFamily: FontFamily,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.text,
    backgroundColor: Colors.bgLight,
    marginBottom: Spacing.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryChipText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.text },
  categoryChipTextActive: { color: Colors.white },
  addCatChip: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    padding: Spacing.md + 2,
    borderRadius: BorderRadius.sm,
  },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.lg },
});

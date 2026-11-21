import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/theme/ThemeProvider';
import { ALL_CATEGORY, type Category } from '@/src/types';
import { Chip } from './Chip';

export interface CategoryTabsProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (category: Category) => void;
  counts?: Record<string, number>;
  totalCount?: number;
  showAll?: boolean;
}

export function CategoryTabs({
  categories,
  selectedId,
  onSelect,
  counts,
  totalCount,
  showAll = true,
}: CategoryTabsProps) {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const items: Category[] = showAll ? [ALL_CATEGORY, ...categories] : categories;

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {items.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            selected={selectedId === category.id}
            count={
              category.id === ALL_CATEGORY.id
                ? totalCount
                : counts?.[category.id]
            }
            accessibilityLabel={`${category.name} category`}
            onPress={() => onSelect(category)}
          />
        ))}
      </ScrollView>

      <LinearGradient
        pointerEvents="none"
        colors={[colors.bg, 'transparent']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fade, styles.fadeLeft]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', colors.bg]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.fade, styles.fadeRight]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  fade: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 24,
  },
  fadeLeft: {
    left: 0,
  },
  fadeRight: {
    right: 0,
  },
});

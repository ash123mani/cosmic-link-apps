import { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, Shadow } from '@/constants/theme';

interface Category {
  name: string;
  id: string;
}

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (cat: Category) => void;
}

export function CategoryTabs({ categories, selectedId, onSelect }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const canScrollLeft = scrollX > 10;
  const canScrollRight = contentWidth - containerWidth - scrollX > 10;

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  }, []);

  const onContentSizeChange = useCallback((w: number) => {
    setContentWidth(w);
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(e.nativeEvent.contentOffset.x);
  }, []);

  const scrollTo = (direction: 'left' | 'right') => {
    const offset = direction === 'right' ? scrollX + containerWidth * 0.7 : Math.max(0, scrollX - containerWidth * 0.7);
    scrollRef.current?.scrollTo({ x: offset, animated: true });
  };

  return (
    <View style={styles.wrapper} onLayout={onLayout}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.container}
        onContentSizeChange={onContentSizeChange}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {categories.map(cat => (
          <Pressable
            key={cat.id}
            style={[styles.tab, selectedId === cat.id && styles.tabActive]}
            onPress={() => onSelect(cat)}
          >
            <Text style={[styles.tabText, selectedId === cat.id && styles.tabTextActive]}>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {canScrollLeft && (
        <Pressable style={styles.arrowLeft} onPress={() => scrollTo('left')}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
      )}
      {canScrollRight && (
        <Pressable style={styles.arrowRight} onPress={() => scrollTo('right')}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    zIndex: 1,
  },
  container: {
    flexGrow: 0,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + Spacing.xs,
  },
  tab: {
    paddingHorizontal: Spacing.xl - 12,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.white,
    marginRight: Spacing.sm,
    ...Shadow.tab,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.blackMedium,
  },
  tabTextActive: { color: Colors.white },
  arrowLeft: {
    position: 'absolute',
    left: 0,
    top: Spacing.sm + Spacing.xs,
    bottom: Spacing.sm + Spacing.xs,
    width: 28,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.blackLight,
    ...Shadow.md,
  },
  arrowRight: {
    position: 'absolute',
    right: 0,
    top: Spacing.sm + Spacing.xs,
    bottom: Spacing.sm + Spacing.xs,
    width: 28,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.blackLight,
    ...Shadow.md,
  },
  arrowText: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: -1,
  },
});

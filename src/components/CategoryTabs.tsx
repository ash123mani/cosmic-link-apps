import { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing, FontSize, Animation } from '@/constants/theme';
import { PressableScale } from './PressableScale';

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
    <Animated.View entering={FadeIn.duration(Animation.duration.normal)}>
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
            <PressableScale
              key={cat.id}
              style={[styles.tab, selectedId === cat.id && styles.tabActive]}
              onPress={() => onSelect(cat)}
            >
              <MaterialIcons
                name="folder"
                size={14}
                color={selectedId === cat.id ? Colors.white : Colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.tabText, selectedId === cat.id && styles.tabTextActive]}>
                {cat.name}
              </Text>
            </PressableScale>
          ))}
        </ScrollView>

        {canScrollLeft && (
          <PressableScale style={styles.arrowLeft} onPress={() => scrollTo('left')}>
            <MaterialIcons name="chevron-left" size={20} color={Colors.primary} />
          </PressableScale>
        )}
        {canScrollRight && (
          <PressableScale style={styles.arrowRight} onPress={() => scrollTo('right')}>
            <MaterialIcons name="chevron-right" size={20} color={Colors.primary} />
          </PressableScale>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
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
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  tabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  tabTextActive: { color: Colors.white },
  arrowLeft: {
    position: 'absolute',
    left: 0,
    top: Spacing.sm + Spacing.xs,
    bottom: Spacing.sm + Spacing.xs,
    width: 28,
    backgroundColor: Colors.bgLight,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  arrowRight: {
    position: 'absolute',
    right: 0,
    top: Spacing.sm + Spacing.xs,
    bottom: Spacing.sm + Spacing.xs,
    width: 28,
    backgroundColor: Colors.bgLight,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },

});

import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/constants/theme';

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
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginRight: 8,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackMedium,
  },
  tabTextActive: { color: Colors.white },
});

import { View, Text, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/theme';

interface LinkMeta {
  siteName?: string;
  title?: string;
  description?: string;
  linkUrl?: string;
  imageUrl?: string;
}

interface Props {
  meta: LinkMeta | null;
}

export function LinkMetaPreview({ meta }: Props) {
  if (!meta) return null;

  return (
    <View style={styles.container}>
      {meta.imageUrl ? (
        <Image source={{ uri: meta.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : null}
      <View style={styles.info}>
        {meta.title ? <Text style={styles.title} numberOfLines={2}>{meta.title}</Text> : null}
        {meta.description ? <Text style={styles.description} numberOfLines={2}>{meta.description}</Text> : null}
        {meta.siteName ? <Text style={styles.siteName}>{meta.siteName}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bodyBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: { width: '100%', height: 160 },
  info: { padding: 12 },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.blackMedium,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    
    color: Colors.gray,
    marginBottom: 4,
  },
  siteName: {
    fontSize: 12,
    color: Colors.primary,
  },
});

import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { hostOf, type LinkItem } from '@/src/types';
import { Pressable } from './Pressable';
import { IconButton } from './IconButton';
import { Text } from './Text';

export interface LinkRowProps {
  link: LinkItem;
  onPress?: () => void;
  onLongPress?: () => void;
  onMore?: () => void;
  onCopy?: () => void;
  onOpen?: () => void;
  showCategory?: boolean;
}

export function LinkRow({ link, onPress, onLongPress, onMore, onCopy, onOpen, showCategory = true }: LinkRowProps) {
  const { colors } = useTheme();
  const host = hostOf(link.linkUrl);
  const categoryName = showCategory ? link.category?.name : undefined;
  const title = link.title || host || 'Untitled link';

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderStrong }]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        haptic="light"
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${title}${categoryName ? `, in ${categoryName}` : ''}`}
        style={styles.main}
      >
        {link.imageUrl ? (
          <Image
            source={{ uri: link.imageUrl }}
            style={[styles.thumb, { backgroundColor: colors.surfaceSunken }]}
            contentFit="cover"
            transition={160}
            accessible={false}
          />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback, { backgroundColor: colors.accentMuted, borderColor: colors.borderStrong }]}>
            <MaterialIcons name="public" size={24} color={colors.accent} />
          </View>
        )}

        <View style={styles.content}>
          <Text variant="bodyStrong" numberOfLines={2}>{title}</Text>
          <Text variant="caption" tone="textSecondary" numberOfLines={1}>{host}</Text>
          {categoryName ? <Text variant="caption" tone="textTertiary" numberOfLines={1}>{categoryName}</Text> : null}
          {link.sharedBy?.username ? (
            <View style={[styles.sharedBadge, { backgroundColor: colors.accentMuted }]}>
              <MaterialIcons name="person-outline" size={12} color={colors.accent} />
              <Text variant="caption" tone="accent" numberOfLines={1}>Shared by @{link.sharedBy.username}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Pressable onPress={onOpen} haptic="light" accessibilityRole="button" accessibilityLabel={`Open ${title}`} style={styles.actionBtn}>
          <MaterialIcons name="open-in-new" size={18} color={colors.accent} />
          <Text variant="label" tone="accent">Open</Text>
        </Pressable>
        <Pressable onPress={onCopy} haptic="light" accessibilityRole="button" accessibilityLabel={`Copy ${title}`} style={styles.actionBtn}>
          <MaterialIcons name="content-copy" size={18} color={colors.textSecondary} />
          <Text variant="label" tone="textSecondary">Copy</Text>
        </Pressable>
        {onMore ? (
          <IconButton
            icon={<MaterialIcons name="more-horiz" size={20} color={colors.textSecondary} />}
            onPress={onMore}
            accessibilityLabel={`More actions for ${title}`}
            size={44}
            style={styles.moreBtn}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: 20,
    marginVertical: 6,
    overflow: 'hidden',
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  sharedBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  actionBtn: {
    flex: 1,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  moreBtn: {
    flex: 1,
  },
});

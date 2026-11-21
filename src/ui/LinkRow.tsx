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
  showCategory?: boolean;
}

export function LinkRow({ link, onPress, onLongPress, onMore, showCategory = true }: LinkRowProps) {
  const { colors } = useTheme();
  const host = hostOf(link.linkUrl);
  const categoryName = showCategory ? link.category?.name : undefined;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        haptic="light"
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${link.title || host}${categoryName ? `, in ${categoryName}` : ''}`}
        style={styles.main}
      >
        {link.imageUrl ? (
          <Image
            source={{ uri: link.imageUrl }}
            style={[styles.thumb, { backgroundColor: colors.surfaceElevated }]}
            contentFit="cover"
            transition={160}
            accessible={false}
          />
        ) : (
          <View style={[styles.thumb, styles.thumbFallback, { backgroundColor: colors.accentMuted }]}>
            <MaterialIcons name="public" size={24} color={colors.accent} />
          </View>
        )}

        <View style={styles.content}>
          <Text variant="bodyStrong" numberOfLines={2}>
            {link.title || host || 'Untitled link'}
          </Text>

          <View style={styles.metaRow}>
            <MaterialIcons name="link" size={13} color={colors.textTertiary} />
            <Text
              variant="caption"
              tone="textTertiary"
              numberOfLines={1}
              style={styles.host}
            >
              {host}
            </Text>
          </View>

          {categoryName ? (
            <View style={styles.metaRow}>
              <View style={[styles.dot, { backgroundColor: colors.accent }]} />
              <Text variant="caption" tone="textSecondary" numberOfLines={1}>
                {categoryName}
              </Text>
            </View>
          ) : null}
          {link.sharedBy?.username ? (
            <View style={[styles.sharedBadge, { backgroundColor: colors.accentMuted }]}>
              <MaterialIcons name="person-outline" size={12} color={colors.accent} />
              <Text variant="caption" tone="accent" numberOfLines={1}>
                Shared by @{link.sharedBy.username}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>

      {onMore ? (
        <IconButton
          icon={<MaterialIcons name="more-horiz" size={20} color={colors.textSecondary} />}
          onPress={onMore}
          accessibilityLabel={`More actions for ${link.title || host}`}
          size={40}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 5,
    paddingRight: 8,
  },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 12,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
  },
  thumbFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  host: {
    flexShrink: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sharedBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
  },
});

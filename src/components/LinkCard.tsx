import { View, Text, StyleSheet } from 'react-native';
import { Share, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Clipboard from 'expo-clipboard';
import Animated, { FlipInYLeft, FadeOut, LinearTransition } from 'react-native-reanimated';
import { Colors, BorderRadius, Spacing, FontSize, Animation } from '@/constants/theme';
import { CosmicCard } from './CosmicCard';
import { PressableScale } from './PressableScale';

interface Link {
  id: string;
  linkUrl: string;
  title: string;
  description?: string;
  imageUrl?: string;
  siteName?: string;
  category?: { name: string };
}

interface Props {
  link: Link;
  onDelete: (id: string) => void;
  index?: number;
}

export function LinkCard({ link, onDelete, index = 0 }: Props) {
  const handleShare = async () => {
    try {
      await Share.share({ url: link.linkUrl, message: link.linkUrl });
    } catch {}
  };

  const handleDelete = () => {
    Alert.alert('Delete Link', 'Are you sure you want to delete this link?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(link.id) },
    ]);
  };

  const handleOpen = () => {
    WebBrowser.openBrowserAsync(link.linkUrl);
  };

  const handleCopy = () => {
    Clipboard.setStringAsync(link.linkUrl);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  return (
    <Animated.View
      entering={FlipInYLeft.delay(index * Animation.stagger.card).springify().damping(35).stiffness(50)}
      exiting={FadeOut.duration(Animation.duration.normal)}
      layout={LinearTransition.duration(Animation.duration.normal)}
    >
      <CosmicCard style={{ marginHorizontal: 16, marginVertical: 6 }}>
        <PressableScale onPress={handleOpen}>
          <Text style={styles.title} numberOfLines={2}>{link.title}</Text>
          <Text style={styles.url} numberOfLines={1}>{link.linkUrl}</Text>
          {link.description ? <Text style={styles.description} numberOfLines={2}>{link.description}</Text> : null}
          {link.siteName ? <Text style={styles.siteName}>{link.siteName}</Text> : null}
        </PressableScale>
        <View style={styles.actions}>
          <PressableScale style={styles.actionBtn} onPress={handleOpen}>
            <MaterialIcons name="open-in-new" size={16} color={Colors.blue} />
            <Text style={[styles.actionText, { color: Colors.blue }]}>Open</Text>
          </PressableScale>
          <PressableScale style={styles.actionBtn} onPress={handleCopy}>
            <MaterialIcons name="content-copy" size={16} color={Colors.text} />
            <Text style={styles.actionText}>Copy</Text>
          </PressableScale>
          <PressableScale style={styles.actionBtn} onPress={handleShare}>
            <MaterialIcons name="ios-share" size={16} color={Colors.text} />
            <Text style={styles.actionText}>Share</Text>
          </PressableScale>
          <PressableScale style={styles.deleteBtn} onPress={handleDelete}>
            <MaterialIcons name="delete-outline" size={16} color={Colors.error} />
            <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
          </PressableScale>
        </View>
      </CosmicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  url: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xs,
  },
  siteName: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.bgLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.text,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
  },
});

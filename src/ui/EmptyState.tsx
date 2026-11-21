import { type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Button } from './Button';
import { Text } from './Text';

type IconName = ComponentProps<typeof MaterialIcons>['name'];

export interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'bookmark-outline', title, description, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.accentMuted }]}>
        <MaterialIcons name={icon} size={30} color={colors.accent} />
      </View>
      <Text variant="title3" align="center" style={styles.title}>
        {title}
      </Text>
      {description ? (
        <Text variant="body" tone="textSecondary" align="center" style={styles.description}>
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} fullWidth={false} size="md" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    maxWidth: 300,
  },
  action: {
    marginTop: 20,
    minWidth: 160,
  },
});

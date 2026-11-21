import { StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import { Button } from './Button';
import { Text } from './Text';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Couldn't load your links",
  description = 'Check your connection and try again.',
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrap, { backgroundColor: colors.dangerMuted }]}>
        <MaterialIcons name="cloud-off" size={28} color={colors.danger} />
      </View>
      <Text variant="title3" align="center" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" tone="textSecondary" align="center" style={styles.description}>
        {description}
      </Text>
      {onRetry ? (
        <View style={styles.action}>
          <Button label={retryLabel} onPress={onRetry} variant="secondary" fullWidth={false} />
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
  },
});

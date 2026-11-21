import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { Card, Divider, IconButton, Text } from '@/src/ui';

export default function ProfileInfoScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton
          icon={<MaterialIcons name="arrow-back" size={24} color={colors.text} />}
          accessibilityLabel="Go back"
          variant="surface"
          onPress={() => router.back()}
        />
        <Text variant="title2" style={styles.headerTitle}>
          Personal info
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.avatar, { backgroundColor: colors.accentMuted }]}>
          <MaterialIcons name="person" size={36} color={colors.accent} />
        </View>
        <Text variant="title2" style={styles.name}>
          {user?.username || '-'}
        </Text>

        <Card padding={0} style={styles.card}>
          <View style={styles.fieldRow}>
            <Text variant="label" tone="textTertiary">
              Username
            </Text>
            <Text variant="body" numberOfLines={1}>
              {user?.username || '-'}
            </Text>
          </View>
          <Divider />
          <View style={styles.fieldRow}>
            <Text variant="label" tone="textTertiary">
              Email
            </Text>
            <Text variant="body" numberOfLines={1}>
              {user?.email || '-'}
            </Text>
          </View>
        </Card>

        <Text variant="caption" tone="textTertiary" style={styles.hint}>
          Profile editing is on the way. Reach out via Contact us if you need to update your
          account details.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  headerTitle: {
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: spacing[2],
  },
  name: {
    textAlign: 'center',
    marginTop: spacing[3],
    marginBottom: spacing[5],
  },
  card: {
    marginTop: spacing[2],
  },
  fieldRow: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: 4,
  },
  hint: {
    marginTop: spacing[4],
    lineHeight: 18,
  },
});

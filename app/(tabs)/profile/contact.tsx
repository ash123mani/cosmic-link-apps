import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { Card, IconButton, Pressable, Text } from '@/src/ui';

const SUPPORT_EMAIL = 'copycutsave@gmail.com';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const openMail = () => {
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}`);
  };

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
          Contact us
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentMuted }]}>
            <MaterialIcons name="support-agent" size={30} color={colors.accent} />
          </View>
          <Text variant="title3" style={styles.heading}>
            We&apos;re here to help
          </Text>
          <Text variant="bodySm" tone="textSecondary" style={styles.body}>
            Questions, feedback or ideas for Cosmic Link? Send us a note and we&apos;ll get back to
            you as soon as we can.
          </Text>

          <Pressable
            onPress={openMail}
            haptic="light"
            accessibilityRole="link"
            accessibilityLabel={`Email ${SUPPORT_EMAIL}`}
            style={[
              styles.emailRow,
              { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
            ]}
          >
            <MaterialIcons name="mail" size={20} color={colors.accent} />
            <Text variant="bodyStrong" color={colors.accent} numberOfLines={1}>
              {SUPPORT_EMAIL}
            </Text>
          </Pressable>
        </Card>
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
  card: {
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[2],
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    lineHeight: 20,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    marginTop: spacing[1],
  },
});

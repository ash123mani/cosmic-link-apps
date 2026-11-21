import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/theme/ThemeProvider';
import type { ThemePreference } from '@/src/theme/themes';
import { spacing } from '@/src/theme/tokens';
import {
  Button,
  Card,
  Divider,
  Pressable,
  SegmentedControl,
  Text,
} from '@/src/ui';

const THEME_OPTIONS = [
  { label: 'System', value: 'system' as ThemePreference },
  { label: 'Light', value: 'light' as ThemePreference },
  { label: 'Dark', value: 'dark' as ThemePreference },
];

interface MenuRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  last?: boolean;
}

export default function ProfileIndexScreen() {
  const insets = useSafeAreaInsets();
  const { colors, preference, setPreference } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const MenuRow = ({ icon, label, onPress, last }: MenuRowProps) => (
    <>
      <Pressable
        onPress={onPress}
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.menuRow}
      >
        <View style={[styles.menuIcon, { backgroundColor: colors.accentMuted }]}>
          <MaterialIcons name={icon} size={20} color={colors.accent} />
        </View>
        <Text variant="body" style={styles.menuLabel}>
          {label}
        </Text>
        <MaterialIcons name="chevron-right" size={22} color={colors.textTertiary} />
      </Pressable>
      {last ? null : <Divider style={styles.menuDivider} />}
    </>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing[3] }]}
      showsVerticalScrollIndicator={false}
    >
      <Text variant="title1">Profile</Text>

      <Card style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.accentMuted }]}>
          <MaterialIcons name="person" size={32} color={colors.accent} />
        </View>
        <View style={styles.profileText}>
          <Text variant="title3" numberOfLines={1}>
            {user?.username || 'Your account'}
          </Text>
          <Text variant="bodySm" tone="textSecondary" numberOfLines={1}>
            {user?.email || '-'}
          </Text>
        </View>
      </Card>

      <Text variant="overline" tone="textTertiary" style={styles.sectionTitle}>
        Appearance
      </Text>
      <Card style={styles.appearanceCard}>
        <SegmentedControl
          options={THEME_OPTIONS}
          value={preference}
          onChange={setPreference}
          accessibilityLabel="Theme preference"
        />
        <Text variant="caption" tone="textTertiary" style={styles.appearanceHint}>
          {preference === 'system'
            ? 'Following your device appearance.'
            : `Always using the ${preference} theme.`}
        </Text>
      </Card>

      <Text variant="overline" tone="textTertiary" style={styles.sectionTitle}>
        Manage
      </Text>
      <Card padding={0}>
        <MenuRow
          icon="folder"
          label="Categories"
          onPress={() => router.push('/(tabs)/profile/categories')}
        />
        <MenuRow
          icon="person"
          label="Personal info"
          onPress={() => router.push('/(tabs)/profile/info')}
        />
        <MenuRow
          icon="mail"
          label="Contact us"
          onPress={() => router.push('/(tabs)/profile/contact')}
          last
        />
      </Card>

      <Button
        label="Log out"
        variant="destructive"
        onPress={() => void handleLogout()}
        style={styles.logout}
        leftIcon={<MaterialIcons name="logout" size={20} color={colors.danger} />}
      />

      <Text variant="caption" tone="textTertiary" style={styles.version}>
        Cosmic Link
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[10],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    marginTop: spacing[6],
    marginBottom: spacing[2],
  },
  appearanceCard: {
    gap: spacing[3],
  },
  appearanceHint: {
    marginTop: spacing[2],
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
  },
  menuDivider: {
    marginLeft: spacing[4] + 36 + spacing[3],
  },
  logout: {
    marginTop: spacing[6],
  },
  version: {
    textAlign: 'center',
    marginTop: spacing[5],
  },
});

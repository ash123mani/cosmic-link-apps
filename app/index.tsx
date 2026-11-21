import { useEffect, useMemo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Redirect, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FlipInYLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { radius, spacing } from '@/src/theme/tokens';
import { Pressable, Text } from '@/src/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FEATURES = [
  {
    icon: 'ios-share' as const,
    title: 'Save from anywhere',
    desc: 'Share links from any app and keep everything in one place.',
  },
  {
    icon: 'devices' as const,
    title: 'Ready when you are',
    desc: 'Your library is always with you, wherever you go.',
  },
  {
    icon: 'folder' as const,
    title: 'Organise with categories',
    desc: 'Sort links into folders so nothing gets lost.',
  },
  {
    icon: 'search' as const,
    title: 'Find it fast',
    desc: 'Search titles, notes and URLs in seconds.',
  },
];

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  period: number;
  twinkle: boolean;
}

function TwinklingStar({ star }: { star: StarData }) {
  const opacity = useSharedValue(star.baseOpacity);

  useEffect(() => {
    if (!star.twinkle) return;
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: star.period / 2 }),
        withTiming(star.baseOpacity, { duration: star.period / 2 }),
      ),
      -1,
    );
  }, [opacity, star.baseOpacity, star.period, star.twinkle]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size / 2,
          backgroundColor: '#FFFFFF',
        },
        animatedStyle,
      ]}
    />
  );
}

function Nebula({ size, color, left, top }: { size: number; color: string; left: number; top: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        left,
        top,
      }}
    />
  );
}

function FeatureItem({
  icon,
  title,
  desc,
  index,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <Animated.View entering={FadeInDown.delay(350 + index * 120).duration(400)} style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <MaterialIcons name={icon} size={22} color="#FFFFFF" />
      </View>
      <View style={styles.featureText}>
        <Text variant="bodyStrong" color="#FFFFFF">
          {title}
        </Text>
        <Text variant="bodySm" color="rgba(255,255,255,0.6)" style={styles.featureDesc}>
          {desc}
        </Text>
      </View>
    </Animated.View>
  );
}

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const stars = useMemo<StarData[]>(() => {
    const result: StarData[] = [];
    for (let i = 0; i < 50; i += 1) {
      result.push({
        id: i,
        x: Math.random() * SCREEN_WIDTH,
        y: Math.random() * 900,
        size: Math.random() * 2.5 + 0.5,
        baseOpacity: Math.random() * 0.5 + 0.3,
        period: Math.random() * 2500 + 1000,
        twinkle: Math.random() > 0.35,
      });
    }
    return result;
  }, []);

  if (user) {
    return <Redirect href="/(tabs)/links" />;
  }

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#07071A', '#12082A', '#1A0A30', '#0F0820', '#08081A']}
          style={StyleSheet.absoluteFill}
        >
          <Nebula size={300} color="rgba(124, 58, 237, 0.12)" left={-70} top={80} />
          <Nebula size={360} color="rgba(59, 130, 246, 0.08)" left={SCREEN_WIDTH * 0.5} top={280} />
          <Nebula size={260} color="rgba(236, 72, 153, 0.07)" left={20} top={580} />
          {stars.map((star) => (
            <TwinklingStar key={star.id} star={star} />
          ))}
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing[8] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + spacing[8] }]}>
          <Animated.Image
            source={require('@/assets/cosmic-link-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            entering={FlipInYLeft.duration(700).springify().damping(18).stiffness(80)}
          />
          <Animated.View entering={FadeInDown.delay(200).duration(500)}>
            <Text variant="title1" color="#FFFFFF" align="center">
              All your links, organised.
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(300).duration(500)}>
            <Text variant="body" color="rgba(255,255,255,0.6)" align="center" style={styles.subtitle}>
              Save links from any app, find them anywhere, and never lose a good find again.
            </Text>
          </Animated.View>
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.card}>
          <Text variant="overline" color="rgba(255,255,255,0.45)" style={styles.sectionLabel}>
            Features
          </Text>
          {FEATURES.map((feature, index) => (
            <FeatureItem
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              index={index}
            />
          ))}
        </Animated.View>

        <View style={styles.ctaSection}>
          <Animated.View entering={FadeInDown.delay(800).duration(500)} style={styles.ctaItem}>
            <Pressable
              onPress={() => router.push('/(auth)/login')}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              style={styles.primaryButton}
            >
              <MaterialIcons name="login" size={20} color="#7C3AED" />
              <Text variant="bodyStrong" color="#7C3AED">
                Sign in
              </Text>
            </Pressable>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(900).duration(500)} style={styles.ctaItem}>
            <Pressable
              onPress={() => router.push('/(auth)/register')}
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel="Create account"
              style={styles.secondaryButton}
            >
              <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
              <Text variant="bodyStrong" color="#FFFFFF">
                Create account
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: spacing[6],
    paddingBottom: spacing[4],
  },
  logo: {
    width: '100%',
    height: SCREEN_WIDTH * 0.55,
  },
  subtitle: {
    marginTop: spacing[2],
    lineHeight: 22,
    paddingHorizontal: spacing[2],
  },
  card: {
    marginHorizontal: spacing[4],
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: radius.md,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionLabel: {
    marginBottom: spacing[3],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
    gap: 2,
  },
  featureDesc: {
    lineHeight: 18,
  },
  ctaSection: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[5],
    gap: spacing[3],
  },
  ctaItem: {
    width: '100%',
  },
  primaryButton: {
    minHeight: 54,
    borderRadius: radius.sm,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  secondaryButton: {
    minHeight: 54,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
});

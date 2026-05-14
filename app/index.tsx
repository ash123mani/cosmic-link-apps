import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { router, Redirect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FlipInYLeft, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useEffect, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { PressableScale } from '@/src/components/PressableScale';
import { Colors, BorderRadius, Spacing, FontSize } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const features = [
  {
    icon: 'ios-share',
    title: 'Save from Any App',
    desc: 'Share links directly from Chrome, Twitter, and any app with one tap. Keep everything in one place and access it from anywhere.',
  },
  {
    icon: 'devices',
    title: 'Mobile & Web',
    desc: 'Your links are always available across devices. Save on mobile, open on web.',
  },
  {
    icon: 'folder',
    title: 'Organize with Folders',
    desc: 'Sort links into custom categories and folders. Find what you need instantly.',
  },
  {
    icon: 'search',
    title: 'Search Instantly',
    desc: 'Powerful search across all your saved links and descriptions. Never lose a link again.',
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
  }, []);

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

function FeatureItem({ icon, title, desc, index }: { icon: string; title: string; desc: string; index: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(350 + index * 120).duration(400)} style={styles.featureRow}>
      <View style={styles.featureIcon}>
        <MaterialIcons name={icon as any} size={22} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </Animated.View>
  );
}

export default function LandingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const stars = useMemo(() => {
    const result: StarData[] = [];
    for (let i = 0; i < 50; i++) {
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
    <View style={{ flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={['#07071A', '#12082A', '#1A0A30', '#0F0820', '#08081A']}
          style={{ flex: 1 }}
        >
          <Nebula size={300} color="rgba(124, 58, 237, 0.12)" left={-70} top={80} />
          <Nebula size={360} color="rgba(59, 130, 246, 0.08)" left={SCREEN_WIDTH * 0.5} top={280} />
          <Nebula size={260} color="rgba(236, 72, 153, 0.07)" left={20} top={580} />
          {stars.map((s) => (
            <TwinklingStar key={s.id} star={s} />
          ))}
        </LinearGradient>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + Spacing.xl }]}>
          <Animated.Image
            source={require('@/assets/cosmic-link-logo.png')}
            style={styles.logo}
            resizeMode="contain"
            entering={FlipInYLeft.duration(700).springify().damping(18).stiffness(80)}
          />
          <Animated.Text entering={FadeInDown.delay(200).duration(500)} style={styles.tagline}>
            All your links, organized.
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(300).duration(500)} style={styles.subtitle}>
            Save links from any app, access them anywhere, and find what you need in seconds.
          </Animated.Text>
        </View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.card}>
          <Text style={styles.sectionLabel}>Features</Text>
          {features.map((f, i) => (
            <FeatureItem key={f.title} icon={f.icon} title={f.title} desc={f.desc} index={i} />
          ))}
        </Animated.View>

        <View style={styles.ctaSection}>
          <Animated.View entering={FadeInDown.delay(800).duration(500)} style={{ width: '100%' }}>
            <PressableScale style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
              <MaterialIcons name="login" size={20} color={Colors.primary} />
              <Text style={styles.primaryButtonText}>  Login</Text>
            </PressableScale>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(900).duration(500)} style={{ width: '100%' }}>
            <PressableScale style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
              <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
              <Text style={styles.secondaryButtonText}>  Create Account</Text>
            </PressableScale>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingBottom: Spacing.xl },
  hero: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  logo: { width: '100%', height: SCREEN_WIDTH * 0.55 },
  tagline: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm + 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featureDesc: {
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
    lineHeight: 17,
  },
  ctaSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.sm + 4,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md + 2,
  },
  primaryButtonText: { color: Colors.primary, fontWeight: '700', fontSize: FontSize.lg },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md + 2,
    backgroundColor: 'transparent',
  },
  secondaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: FontSize.lg },
});

import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Spacing } from '@/constants/theme';
import { CosmicCard } from './CosmicCard';

const SkeletonColor = 'rgba(0,0,0,0.06)';
const ShimmerColor = 'rgba(0,0,0,0.03)';

function ShimmerLayer() {
  const translateX = useSharedValue(-120);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(500, { duration: 1500, easing: Easing.ease }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View style={[styles.shimmerTrack, animatedStyle]}>
      <LinearGradient
        colors={['transparent', ShimmerColor, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

function SkeletonBlock({
  width,
  height,
  style,
}: {
  width?: string | number;
  height: number;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          width: width || '100%',
          height,
          backgroundColor: SkeletonColor,
          borderRadius: 6,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <ShimmerLayer />
    </View>
  );
}

export function SkeletonCard() {
  return (
    <Animated.View
      exiting={FadeOut.duration(200)}
      layout={LinearTransition.duration(300)}
    >
      <CosmicCard padding={16} style={{ marginHorizontal: 16, marginVertical: 6 }}>
        <SkeletonBlock width="70%" height={18} style={{ marginBottom: Spacing.sm }} />
        <SkeletonBlock width="50%" height={14} style={{ marginBottom: Spacing.sm }} />
        <SkeletonBlock width="85%" height={14} style={{ marginBottom: Spacing.md }} />
        <View style={styles.actions}>
          <SkeletonBlock width={70} height={30} />
          <SkeletonBlock width={70} height={30} />
          <SkeletonBlock width={70} height={30} />
        </View>
      </CosmicCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shimmerTrack: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 120,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});

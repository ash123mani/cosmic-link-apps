import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radiusValue?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 14, radiusValue = 6, style }: SkeletonProps) {
  const { colors } = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    progress.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.linear }),
      -1,
      false,
    );
  }, [progress, reduceMotion]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -120 + progress.value * 360 }],
  }));

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius: radiusValue,
          backgroundColor: colors.skeleton,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {!reduceMotion ? (
        <Animated.View style={[styles.shimmer, animatedStyle]}>
          <LinearGradient
            colors={['transparent', colors.skeletonHighlight, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

export function LinkRowSkeleton() {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Skeleton width={56} height={56} radiusValue={radius.sm} />
      <View style={styles.rowContent}>
        <Skeleton width="75%" height={16} />
        <Skeleton width="45%" height={12} style={{ marginTop: 8 }} />
        <Skeleton width="60%" height={12} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 5,
  },
  rowContent: {
    flex: 1,
  },
});

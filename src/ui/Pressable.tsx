import { type ReactNode } from 'react';
import { Pressable as RNPressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { spring } from '@/src/theme/motion';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export type HapticFeedback = 'none' | 'light' | 'medium' | 'selection';

export interface PressableProps_ extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  scaleIn?: number;
  haptic?: HapticFeedback;
}

export function Pressable({
  children,
  scaleIn = 0.97,
  haptic = 'none',
  style,
  disabled,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableProps_) {
  const scale = useSharedValue(1);
  const reduceMotion = useReducedMotion();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: PressableProps['onPressIn'] = (event) => {
    if (!reduceMotion) {
      scale.value = withSpring(scaleIn, spring.press);
    }
    onPressIn?.(event);
  };

  const handlePressOut: PressableProps['onPressOut'] = (event) => {
    scale.value = withSpring(1, spring.press);
    onPressOut?.(event);
  };

  const handlePress: PressableProps['onPress'] = (event) => {
    if (haptic === 'light') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (haptic === 'medium') void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (haptic === 'selection') void Haptics.selectionAsync();
    onPress?.(event);
  };

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={[animatedStyle, style]}
    >
      {children}
    </AnimatedPressable>
  );
}

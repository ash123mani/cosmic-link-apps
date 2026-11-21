import { Easing } from 'react-native-reanimated';

export const duration = {
  instant: 90,
  fast: 150,
  normal: 220,
  slow: 320,
  slower: 460,
} as const;

export const easing = {
  standard: Easing.bezier(0.2, 0, 0, 1),
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0, 1, 1),
  emphasized: Easing.bezier(0.2, 0, 0, 1),
} as const;

export const spring = {
  press: { damping: 20, stiffness: 320, mass: 0.6 },
  gentle: { damping: 22, stiffness: 180, mass: 0.9 },
  snappy: { damping: 26, stiffness: 360, mass: 0.7 },
} as const;

export const stagger = {
  card: 45,
  max: 6,
} as const;

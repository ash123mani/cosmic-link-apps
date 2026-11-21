import { useReducedMotion } from 'react-native-reanimated';
import { duration as durations } from './motion';

export function useMotion() {
  const reduceMotion = useReducedMotion();

  return {
    reduceMotion,
    duration: {
      instant: reduceMotion ? 0 : durations.instant,
      fast: reduceMotion ? 0 : durations.fast,
      normal: reduceMotion ? 0 : durations.normal,
      slow: reduceMotion ? 0 : durations.slow,
      slower: reduceMotion ? 0 : durations.slower,
    },
  };
}

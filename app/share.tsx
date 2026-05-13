import { Redirect, useLocalSearchParams } from 'expo-router';
import { setSharedUrl } from '@/src/hooks/shareStore';

export default function Share() {
  const { url } = useLocalSearchParams<{ url?: string }>();

  if (url) {
    setSharedUrl(url);
  }

  return <Redirect href="/(tabs)/links" />;
}

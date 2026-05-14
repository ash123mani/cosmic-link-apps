import { Redirect, useLocalSearchParams } from 'expo-router';

export default function Share() {
  const { url } = useLocalSearchParams<{ url?: string }>();

  if (url) {
    return <Redirect href={`/(tabs)/add-link?url=${encodeURIComponent(url)}`} />;
  }

  return <Redirect href="/(tabs)/links" />;
}

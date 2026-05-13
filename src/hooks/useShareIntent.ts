import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { getSharedUrl } from './shareStore';

function extractUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const match = text.match(urlRegex);
  return match ? match[0] : null;
}

export function useShareIntent() {
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const clear = () => {
    setSharedUrl(null);
    setPending(false);
  };

  useEffect(() => {
    async function handleInitial() {
      const stored = getSharedUrl();
      if (stored) {
        setSharedUrl(stored);
        setPending(true);
        return;
      }

      const url = await Linking.getInitialURL();
      if (url) {
        const parsed = Linking.parse(url);
        const extracted = extractUrl(parsed.path || parsed.queryParams?.url || url);
        if (extracted) {
          setSharedUrl(extracted);
          setPending(true);
          return;
        }
      }

      const text = await Clipboard.getUrlAsync().catch(() => null);
      if (text) {
        const extracted = extractUrl(text);
        if (extracted) {
          setSharedUrl(extracted);
          setPending(true);
        }
      }
    }

    handleInitial();

    const sub = Linking.addEventListener('url', ({ url }) => {
      const parsed = Linking.parse(url);
      const extracted = extractUrl(parsed.path || parsed.queryParams?.url || url);
      if (extracted) {
        setSharedUrl(extracted);
        setPending(true);
      }
    });

    return () => sub.remove();
  }, []);

  return { sharedUrl, pending, clear };
}

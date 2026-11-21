import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  themes,
  type Theme,
  type ThemeColors,
  type ThemeName,
  type ThemePreference,
} from './themes';

const STORAGE_KEY = 'cosmic_link_theme_preference';

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
  isSystem: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

async function readStoredPreference(): Promise<ThemePreference | null> {
  try {
    const value = await SecureStore.getItemAsync(STORAGE_KEY);
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
  } catch {
    // SecureStore is unavailable on some platforms (e.g. web); fall back to system.
  }
  return null;
}

async function persistPreference(pref: ThemePreference) {
  try {
    await SecureStore.setItemAsync(STORAGE_KEY, pref);
  } catch {
    // Ignore persistence failures; the in-memory preference still applies.
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    let mounted = true;
    readStoredPreference().then((stored) => {
      if (mounted && stored) setPreferenceState(stored);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    void persistPreference(pref);
  }, []);

  const resolvedName: ThemeName =
    preference === 'system' ? (systemScheme === 'light' ? 'light' : 'dark') : preference;

  const theme = themes[resolvedName];

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: theme.colors,
      preference,
      setPreference,
      isSystem: preference === 'system',
    }),
    [theme, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function useColors(): ThemeColors {
  return useTheme().colors;
}

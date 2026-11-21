import { useEffect, useMemo } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { ThemeProvider, useTheme } from '@/src/theme/ThemeProvider';
import { ToastProvider } from '@/src/ui/Toast';
import { queryClient } from '@/src/data/queryClient';
import { addPushListeners, registerPushNotifications } from '@/src/notifications/push';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { theme, colors } = useTheme();

  const navigationTheme = useMemo(() => {
    const base = theme.isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.accent,
        background: colors.bg,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
    };
  }, [theme.isDark, colors]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(auth)/forgot-password" />
        <Stack.Screen name="(auth)/reset-password/[token]" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="link/[id]" />
      </Stack>
    </NavigationThemeProvider>
  );
}

function AppGate({ fontsReady }: { fontsReady: boolean }) {
  const { loading, user } = useAuth();
  const { theme, colors } = useTheme();
  const ready = fontsReady && !loading;

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  useEffect(() => {
    if (!ready || !user) return;
    void registerPushNotifications();
    const removeListeners = addPushListeners();
    return removeListeners;
  }, [ready, user]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <RootNavigator />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </View>
  );
}

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <ToastProvider>
                <AppGate fontsReady={fontsLoaded || !!fontError} />
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState } from 'react-native';
import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    const handler = (error: Error) => {
      console.error('[GlobalError]', error);
    };
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('[UnhandledRejection]', event.reason);
    };
    const appStateHandler = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('[AppState] foregrounded');
      }
    };

    (global as unknown as Record<string, unknown>).onerror = handler;
    (global as unknown as Record<string, unknown>).onunhandledrejection =
      rejectionHandler;
    const subscription = AppState.addEventListener('change', appStateHandler);

    return () => {
      (global as unknown as Record<string, unknown>).onerror = null;
      (global as unknown as Record<string, unknown>).onunhandledrejection = null;
      subscription.remove();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    Inter18: require('../assets/fonts/Inter_18pt-Regular.ttf'),
    Inter18Bold: require('../assets/fonts/Inter_18pt-Bold.ttf'),
    Inter24: require('../assets/fonts/Inter_24pt-Regular.ttf'),
    Inter24Bold: require('../assets/fonts/Inter_24pt-Bold.ttf'),
    Inter28: require('../assets/fonts/Inter_28pt-Regular.ttf'),
    Inter28Bold: require('../assets/fonts/Inter_28pt-Bold.ttf'),
    Play: require('../assets/fonts/play/PlaywriteIE-Regular.ttf'),
    PlayThin: require('../assets/fonts/play/PlaywriteIE-Thin.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="marketinsight" />
          <Stack.Screen name="dailypricelist" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="publicoffers" />
          <Stack.Screen name="verifyemail" />
          <Stack.Screen name="pricealert" />
          <Stack.Screen name="pricechart" />
          <Stack.Screen name="disclaimer" />
          <Stack.Screen name="+not-found" />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
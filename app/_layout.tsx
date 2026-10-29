import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { AppState } from 'react-native';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { checkForUpdate, dismissUpdate } from '@/services/versionService';
import { UpdateModal } from '@/components/UpdateModal';

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
      (global as unknown as Record<string, unknown>).onunhandledrejection =
        null;
      subscription.remove();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    Inter18: require('../assets/fonts/Inter_18pt-Regular.ttf'),
    Inter18Bold: require('../assets/fonts/Inter_18pt-Bold.ttf'),
    Inter18SemiBold: require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    Inter24: require('../assets/fonts/Inter_24pt-Regular.ttf'),
    Inter24Bold: require('../assets/fonts/Inter_24pt-Bold.ttf'),
    Inter24SemiBold: require('../assets/fonts/Inter_24pt-SemiBold.ttf'),
    Inter28: require('../assets/fonts/Inter_28pt-Regular.ttf'),
    Inter28Bold: require('../assets/fonts/Inter_28pt-Bold.ttf'),
    Inter28SemiBold: require('../assets/fonts/Inter_28pt-SemiBold.ttf'),
    Play: require('../assets/fonts/play/PlaywriteIE-Regular.ttf'),
    PlayThin: require('../assets/fonts/play/PlaywriteIE-Thin.ttf'),
  });

  const [shouldShow, setShouldShow] = useState(false);
  const [manifest, setManifest] = useState<{
    message: string;
    forceUpdate: boolean;
    iosStoreUrl: string;
    androidStoreUrl: string;
    minRequiredVersion: string;
  } | null>(null);

  const checkUpdate = async () => {
    const { shouldShow: s, manifest: m } = await checkForUpdate();
    setShouldShow(s);
    setManifest(m ?? null);
  };

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      checkUpdate();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkUpdate();
      }
    });
    return () => subscription.remove();
  }, []);

  const handleDismiss = async () => {
    if (!manifest) return;
    await dismissUpdate(Constants.expoConfig?.version ?? '');
    setShouldShow(false);
    setManifest(null);
  };

  if (!fontsLoaded) {
    return null;
  }

  if (shouldShow && manifest) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <UpdateModal
          visible={shouldShow}
          manifest={manifest}
          onDismiss={handleDismiss}
        />
      </ThemeProvider>
    );
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
          <Stack.Screen name="verifyemail" />
          <Stack.Screen name="pricealert" />
          <Stack.Screen name="pricechart" />
          <Stack.Screen name="disclaimer" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

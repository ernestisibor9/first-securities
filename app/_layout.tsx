import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Alert,
  AppState,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Constants from 'expo-constants';

import { useColorScheme } from '@/hooks/useColorScheme';
import { MIN_REQUIRED_VERSION, STORE_URLS } from '@/constants/AppConfig';

SplashScreen.preventAutoHideAsync();

function parseVersion(version: string): number[] | null {
  const parts = version.split('.').map((p) => Number(p));
  if (parts.length !== 3 || parts.some((n) => !Number.isInteger(n) || n < 0)) {
    return null;
  }
  return parts;
}

function isUpdateRequired(current: string, minimum: string): boolean {
  const currentParts = parseVersion(current);
  const minParts = parseVersion(minimum);

  if (!currentParts || !minParts) {
    console.warn('[UpdateCheck] malformed version', { current, minimum });
    return false;
  }

  for (let i = 0; i < 3; i++) {
    if (currentParts[i] !== minParts[i]) {
      return currentParts[i] < minParts[i];
    }
  }
  return false;
}

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

  const [needsUpdate, setNeedsUpdate] = useState(false);

  const checkUpdate = () => {
    const currentVersion = Constants.expoConfig?.version;
    if (!currentVersion) {
      console.warn('[UpdateCheck] expoConfig.version is missing');
      return;
    }
    setNeedsUpdate(isUpdateRequired(currentVersion, MIN_REQUIRED_VERSION));
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

  const handleUpdate = async () => {
    const url = Platform.OS === 'ios' ? STORE_URLS.ios : STORE_URLS.android;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.error('[UpdateCheck] Linking.openURL failed', e);
      Alert.alert(
        'Unable to open store',
        'Please visit the App Store or Google Play manually to update.'
      );
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (needsUpdate) {
    return (
      <Modal visible={needsUpdate} transparent={false} animationType="fade">
        <View style={styles.updateContainer}>
          <Text style={styles.updateTitle}>Update Required</Text>
          <Text style={styles.updateMessage}>
            Please update to the latest version to continue using the app.
          </Text>
          <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
            <Text style={styles.updateButtonText}>Update Now</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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

const styles = StyleSheet.create({
  updateContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  updateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#002B5B',
    marginBottom: 12,
    textAlign: 'center',
  },
  updateMessage: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  updateButton: {
    backgroundColor: '#002B5B',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

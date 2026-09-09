import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ✅ Load custom fonts
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

  // ⏳ Wait until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
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
  );
}
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Inter: Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="marketinsight" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="dailypricelist" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="signup" options={{ headerShown: false, animation: 'slide_from_bottom' }} />
        <Stack.Screen name="verifyemail" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="pricealert" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="pricechart" options={{ headerShown: false, animation: 'fade_from_bottom' }} />
        <Stack.Screen name="disclaimer" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

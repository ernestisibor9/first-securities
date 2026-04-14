/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0033A0', // Primary brand color
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0033A0',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
  brand: {
    primary: '#0033A0', // FirstInvest Blue
    yellow: '#EAAA00',  // FirstInvest Yellow
    accent: '#EAAA00',  // Alias for yellow used in the app
    secondary: '#4C707F', // Original steel gray color
    palette: {
      purple: '#7a3c97',
      red: '#d11e3a',
      orange: '#f6862b',
      cyan: '#008ec4',
      green: '#79b076',
    },
  }
};

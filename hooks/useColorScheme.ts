import { useColorScheme as useRNColorScheme } from 'react-native';

export const useColorScheme = () => {
  // We call the original hook to satisfy React's "Rules of Hooks" order,
  // but we always return 'light' to force your preferred visual style.
  useRNColorScheme(); 
  return 'light';
};

import * as SecureStore from 'expo-secure-store';

const STORAGE_PREFIX = 'first-securities-app-';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(`${STORAGE_PREFIX}${key}`);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(`${STORAGE_PREFIX}${key}`, value);
    } catch {
      // Silent fail — storage is best-effort
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(`${STORAGE_PREFIX}${key}`);
    } catch {
      // Silent fail
    }
  },
};

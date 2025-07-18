// utils/storage.ts
import { Platform } from 'react-native';

let AsyncStorage: any = null;
if (Platform.OS !== 'web') {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return Promise.resolve(localStorage.getItem(key));
    } else {
      return AsyncStorage.getItem(key);
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } else {
      return AsyncStorage.setItem(key, value);
    }
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    } else {
      return AsyncStorage.removeItem(key);
    }
  },
  async logout() {
    await Promise.all([
      this.removeItem('token'),
      this.removeItem('userId'),
    ]);
  },
}; 
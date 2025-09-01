import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  IS_LOGGED_IN: 'is_logged_in',
};

export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      if (value === undefined || value === null) {
        console.warn(`Attempting to save ${key} with ${value} value`);
        return;
      }

      const jsonValue = JSON.stringify(value);
      await SecureStore.setItemAsync(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      console.error('Key:', key);
      console.error('Value:', value);
      console.error('Value type:', typeof value);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await SecureStore.getItemAsync(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },

  async clear(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN),
        SecureStore.deleteItemAsync(STORAGE_KEYS.USER_DATA),
        SecureStore.deleteItemAsync(STORAGE_KEYS.IS_LOGGED_IN),
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};

export const authStorage = {
  async saveAuthData(token: string, userData: any): Promise<void> {
    try {
      console.log('Saving auth data - Token:', typeof token, token);
      console.log('Saving auth data - UserData:', typeof userData, userData);

      if (!token || typeof token !== 'string') {
        console.error('Invalid token provided to saveAuthData');
        return;
      }

      if (!userData || typeof userData !== 'object') {
        console.error('Invalid userData provided to saveAuthData');
        return;
      }

      await Promise.all([
        storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
        storage.setItem(STORAGE_KEYS.USER_DATA, userData),
        storage.setItem(STORAGE_KEYS.IS_LOGGED_IN, true),
      ]);
    } catch (error) {
      console.error('Error in saveAuthData:', error);
    }
  },

  async getAuthToken(): Promise<string | null> {
    return storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
  },

  async getUserData(): Promise<any | null> {
    return storage.getItem(STORAGE_KEYS.USER_DATA);
  },

  async isLoggedIn(): Promise<boolean> {
    const isLoggedIn = await storage.getItem<boolean>(STORAGE_KEYS.IS_LOGGED_IN);
    return isLoggedIn === true;
  },

  async clearAuthData(): Promise<void> {
    await storage.clear();
  },
};

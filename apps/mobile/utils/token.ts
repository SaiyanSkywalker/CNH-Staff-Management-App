/**
 * File: token.ts
 * Purpose: contains util functions for dealing with token storage and expo's secure store
 */
import * as SecureStore from "expo-secure-store";

/**
 * Sets token in SecureStore
 * @param key key (string) to associate token with
 * @param token JWT token string
 */
export const setToken = async (key: string, token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, token);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Gets token from SecureStore
 * @param key key (string) associated with token
 * @returns JWT token string
 */
export const getToken = async (
  key: string
): Promise<string | null | undefined> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Deletes token from SecureStore
 * @param key string
 */
export const removeToken = async (key: string): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log(error);
  }
};

import * as SecureStore from "expo-secure-store";
export const setToken = async (key: string, token: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, token);
  } catch (error) {
    console.log(error);
  }
};

export const getToken = async (
  key: string
): Promise<string | null | undefined> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log(error);
  }
};

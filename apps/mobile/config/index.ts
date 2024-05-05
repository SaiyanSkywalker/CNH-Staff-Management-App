import { Platform } from "react-native";
interface mobileConfig {
  apiUrl: string;
}
// android doesn't allow you to use localhost
const config: mobileConfig = {
  apiUrl:
    Platform.OS === "android"
      ? "http://10.0.2.2:3003"
      : "http://localhost:3003",
};
export default config;

import { Platform } from "react-native";
interface mobileConfig {
  apiUrl: string;
}

// android doesn't allow you to use localhost
//NOTE: Change this apiUrl for the url of where the server project
// will be hosted
const config: mobileConfig = {
  apiUrl:
    Platform.OS === "android"
      ? "http://10.0.2.2:3003"
      : "http://localhost:3003",
};
export default config;

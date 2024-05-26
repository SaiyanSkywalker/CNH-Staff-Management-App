/**
 * File: index.ts
 * Purpose: Contains info used to configure web app
 */
interface WebConfig {
  apiUrl: string;
}
const config: WebConfig = {
  apiUrl: "http://localhost:3003",
};
export default config;

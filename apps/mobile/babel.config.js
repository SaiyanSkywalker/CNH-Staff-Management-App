module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "@babel/preset-env",
      "@babel/preset-typescript",
    ],
    plugins: [
      "expo-router/babel", // Required for expo-router
      "react-native-reanimated/plugin", // Required for Drawer component
    ],
  };
};

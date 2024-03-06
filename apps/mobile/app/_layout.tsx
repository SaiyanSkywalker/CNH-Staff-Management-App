import { Drawer } from "expo-router/drawer";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
const Layout = () => {
  return (
    <Drawer
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <Ionicons
            name="md-menu"
            size={32}
            color="black"
            style={{ marginLeft: 16 }}
            onPress={navigation.toggleDrawer}
          />
        ),
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Home",
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          drawerLabel: "Login",
          title: "Login",
        }}
      />
    </Drawer>
  );
};
export default Layout;

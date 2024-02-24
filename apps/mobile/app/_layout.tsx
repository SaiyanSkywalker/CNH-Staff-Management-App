import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";

const Layout = () => {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "",
        headerLeft: () => <DrawerToggleButton />,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          title: "overview",
        }}
      />
    </Drawer>
  );
};
export default Layout;

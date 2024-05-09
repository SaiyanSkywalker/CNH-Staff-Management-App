import AuthProvider, { useAuth } from "../contexts/AuthContext";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

import CustomDrawerContent from "../components/CustomDrawerContent";

const Layout = () => {
  return (
    <AuthProvider>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        {/* Screens */}
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
        <Drawer.Screen
          name="chat"
          options={{
            drawerLabel: "Chat",
            title: "Chat",
          }}
        />
        <Drawer.Screen
          name="schedule"
          options={{
            drawerLabel: "Schedule",
            title: "Schedule",
          }}
        />
        <Drawer.Screen
          name="calendar"
          options={{
            drawerLabel: "Calendar",
            title: "Calendar",
          }}
        />
      </Drawer>
    </AuthProvider>
  );
};

export default Layout;

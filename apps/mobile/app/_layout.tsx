import { Stack } from "expo-router";
import AuthProvider from "../contexts/AuthContext";
import React from "react";

const Layout = () => {
  return (
    <>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </>
  );
};
export default Layout;

/**
 * File: index.tsx
 * Purpose: Component for "home" screen, redirects to different screens
 * based on if the user's login status
 *
 */

import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

const Home = () => {
  const authContext = useAuth();
  return (
    <>
      <Redirect
        href={authContext.auth?.authenticated ? `/calendar` : `/login`} // show schedule screen once user is signed in
      />
    </>
  );
};
export default Home;

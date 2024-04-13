import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

const Home = () => {
  const authContext = useAuth();
  return (
    <>
      <Redirect
        href={authContext.auth?.authenticated ? `/schedule` : `/login`}
      />
    </>
  );
};
export default Home;

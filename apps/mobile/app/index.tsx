import { useAuth } from "../contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";

const Home = () => {
  const authContext = useAuth();
  return (
    <>
      <Redirect href={`/chat`} />
    </>
  );
};
export default Home;

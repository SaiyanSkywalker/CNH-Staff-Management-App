import { Redirect } from "expo-router";
import React from "react";

const Home = () => {
  return (
    <>
      <Redirect href={`/calendar`} />
    </>
  );
};
export default Home;

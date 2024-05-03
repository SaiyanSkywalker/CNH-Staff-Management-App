"use client";
import AuthWrapper from "@webSrc/components/AuthWrapper";
import Schedule from "@webSrc/components/Schedule";

const Page = () => {
  return (
    <>
      <Schedule />
    </>
  );
};

export default AuthWrapper(Page);

"use client";
import Login from "@webSrc/components/Login";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const Page = () => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?.authenticated) {
      router.push("/schedule");
    }
  }, [auth, router]);
  return <Login />;
};
export default Page;

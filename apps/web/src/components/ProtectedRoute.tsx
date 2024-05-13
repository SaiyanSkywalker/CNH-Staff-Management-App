"use client";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute(Component: any) {
  const protectedRoute = (props: any) => {
    const { auth } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!auth?.authenticated) {
        router.replace("/login");
      }
    }, []);
    // return auth?.authenticated ? <Component {...props} /> : null;
    return <Component {...props} />;
  };
  return protectedRoute;
}

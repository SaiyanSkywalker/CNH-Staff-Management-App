/**
 * File: ProtectedRoute.tsx
 * Purpose: Wrapper component that checks user authentication
 * before navigating to route
 */
"use client";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProtectedRoute(Component: any) {
  const protectedRoute = (props: any) => {
    const { auth } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Takes signed in user to correct route,
    // Redirects unauthorized user to login page
    useEffect(() => {
      console.log(pathname);
      if (!auth?.authenticated) {
        router.replace("/login");
      } else {
        router.replace(pathname);
      }
    }, [auth?.authenticated, router]);
    return auth?.authenticated ? <Component {...props} /> : null;
  };
  return protectedRoute;
}

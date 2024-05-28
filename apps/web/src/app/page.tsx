/**
 * File: page.tsx
 * Purpose: home page, redirects user based on login status
 *
 */
"use client";
import { useEffect } from "react";
import { useAuth } from "@webSrc/contexts/AuthContext";
import { redirect } from "next/navigation";
export default function Page() {
  const { auth } = useAuth();
  useEffect(() => {
    if (auth?.authenticated) {
      redirect("schedule");
    } else {
      redirect("login");
    }
  }, [auth?.authenticated]);
  return <></>;
}

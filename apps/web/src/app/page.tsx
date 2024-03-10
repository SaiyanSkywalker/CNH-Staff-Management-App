"use client";

import { useAuth } from "@webSrc/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const { auth } = useAuth();
  return (
    <>
      {useEffect(() => {
        !auth?.authenticated
          ? router.replace("/login")
          : router.replace("/schedule"),
          [];
      })}
    </>
  );
}

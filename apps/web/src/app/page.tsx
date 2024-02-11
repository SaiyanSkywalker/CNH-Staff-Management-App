"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  return (
    <>
      {useEffect(() => {router.replace("/login"), []})}
    </>
  );
}
